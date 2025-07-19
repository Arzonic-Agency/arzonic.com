"use client";

import { createClient } from "@/utils/supabase/client";
import { useAuthStore } from "./useAuthStore";
import { readUserSession } from "./readUserSession";

// Henter ALT fra server og sætter i Zustand
export async function fetchAndSetUserSession() {
  try {
    const session = await readUserSession();
    if (!session) {
      useAuthStore.getState().clearSession();
      return;
    }

    const { user, role, facebookLinked, facebookToken } = session;
    useAuthStore.getState().setUser({ id: user.id, email: user.email });
    useAuthStore.getState().setRole(role);
    useAuthStore.getState().setFacebookLinked(facebookLinked);
    useAuthStore.getState().setFacebookToken(facebookToken);
  } catch (err) {
    console.error("fetchAndSetUserSession failed:", err);
    useAuthStore.getState().clearSession();
  }
}

// Lyt på *alle* Supabase-auth ændringer og gen-fetch
export function setupAuthListener() {
  const supabase = createClient();
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async () => {
    await fetchAndSetUserSession();
  });
  return subscription;
}

// clientAuth.ts (dele af filen)

export async function disconnectFacebook() {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return { error: "No user found" };

  const facebookIdentity = user.identities?.find(
    (i: { provider: string }) => i.provider === "facebook"
  );
  if (!facebookIdentity) return { error: "No Facebook identity linked" };

  // 1) Unlink i Supabase
  const { error: unlinkError } = await supabase.auth.unlinkIdentity(
    facebookIdentity
  );
  if (unlinkError) {
    console.error("Error unlinking Facebook identity:", unlinkError);
    return { error: unlinkError.message };
  }

  // 2) Refresh session-cookie på klienten
  await supabase.auth.refreshSession();

  // 3) Genindlæs session fra server + opdater Zustand
  await fetchAndSetUserSession();

  return { success: true };
}
