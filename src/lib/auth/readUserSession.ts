// src/lib/auth/readUserSession.ts
"use server";
import { createServerClientInstance } from "@/utils/supabase/server";

interface Identity {
  provider: string;
}

export async function readUserSession() {
  const supabase = await createServerClientInstance();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return null;

  // Hent role som før…
  const { data: roleResult, error: roleError } = await supabase
    .from("permissions")
    .select("role")
    .eq("member_id", user.id)
    .single();
  if (roleError || !roleResult) return null;

  const facebookLinked = (user.identities as Identity[]).some(
    (i) => i.provider === "facebook"
  );

  // 1) Prøv at hente fra metadata:
  const fbMeta = (user.user_metadata as { facebook_token?: string })
    ?.facebook_token;
  let facebookToken = fbMeta ?? null;

  // 2) Fald tilbage til provider_token hvis metadata var tom:
  if (!facebookToken && facebookLinked) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    facebookToken = session?.provider_token ?? null;
  }

  return {
    user,
    role: roleResult.role as "admin" | "editor" | "developer",
    facebookLinked,
    facebookToken,
  };
}
