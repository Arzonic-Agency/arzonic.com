"use client";

import { createClient } from "@/utils/supabase/client";
import { useAuthStore } from "./useAuthStore";
import { readUserSession } from "./readUserSession";

interface Identity {
  provider: string;
}

// Client-side funktion der henter session data og opdaterer store
export async function fetchAndSetUserSession() {
  try {
    const session = await readUserSession();

    if (session) {
      useAuthStore.getState().setUser({
        id: session.user.id,
        email: session.user.email,
      });
      useAuthStore
        .getState()
        .setRole(session.role as "admin" | "editor" | "developer");
      
      // Tjek både Supabase identities og om vi har et gyldigt token i database
      await updateFacebookLinkedStatus();
    } else {
      useAuthStore.getState().clearSession();
    }
  } catch (error) {
    console.error("Failed to fetch and set session:", error);
    useAuthStore.getState().clearSession();
  }
}

// Gem Facebook token i database
async function saveFacebookTokenToDatabase(token: string) {
  const supabase = createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return;
    }

    // Gem token i social_tokens tabel
    const { error } = await supabase.from("social_tokens").upsert({
      user_id: user.id,
      provider: "facebook",
      access_token: token,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error saving Facebook token:", error);
    }
  } catch (error) {
    console.error("Error in saveFacebookTokenToDatabase:", error);
  }
}

// Hent gemt Facebook token fra database
export async function getSavedFacebookToken() {
  const supabase = createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    const { data, error } = await supabase
      .from("social_tokens")
      .select("access_token, created_at")
      .eq("user_id", user.id)
      .eq("provider", "facebook")
      .single();

    if (error || !data?.access_token) {
      return null;
    }

    // Tjek om token er gyldigt
    const isValid = await isValidFacebookToken(data.access_token);
    
    if (!isValid) {
      // Hvis token er udløbet, fjern det fra database
      await supabase
        .from("social_tokens")
        .delete()
        .eq("user_id", user.id)
        .eq("provider", "facebook");
      
      return null;
    }

    return data.access_token;
  } catch (error) {
    console.error("Error in getSavedFacebookToken:", error);
    return null;
  }
}

// Henter Facebook token fra client side
export async function fetchAndSetFacebookToken() {
  const supabase = createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  // Først prøv at få token fra session
  if (session?.provider_token) {
    useAuthStore.getState().setFacebookToken(session.provider_token);
    return;
  }

  // Hvis ikke i session, prøv at hente fra database
  const savedToken = await getSavedFacebookToken();
  if (savedToken) {
    useAuthStore.getState().setFacebookToken(savedToken);
  } else {
    useAuthStore.getState().clearFacebookToken();
  }
}

export function setupFacebookTokenCapture() {
  const supabase = createClient();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "TOKEN_REFRESHED" || event === "SIGNED_IN") {
      if (session?.provider_token) {
        console.log("🎉 Facebook token captured:", session.provider_token);

        // Gem token i store
        useAuthStore.getState().setFacebookToken(session.provider_token);

        // Gem token i database
        await saveFacebookTokenToDatabase(session.provider_token);

        // Opdater også Facebook linked status
        await updateFacebookLinkedStatus();
        await fetchAndSetUserSession();
      }
    }
  });

  return subscription;
}

// Client-side funktion til at opdatere Facebook status efter linking
export async function updateFacebookLinkedStatus() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!error && user) {
    // Tjek om Facebook identity eksisterer
    const hasIdentity = (user.identities as Identity[])?.some(
      (i) => i.provider === "facebook"
    ) ?? false;

    // Tjek om vi har et gyldigt token i database
    const savedToken = await getSavedFacebookToken();
    
    // Facebook er kun linked hvis vi har både identity og et gyldigt token
    const isFacebookLinked = hasIdentity && !!savedToken;
    
    useAuthStore.getState().setFacebookLinked(isFacebookLinked);
    
    // Hvis vi har et token, sæt det i store
    if (savedToken) {
      useAuthStore.getState().setFacebookToken(savedToken);
    } else {
      useAuthStore.getState().clearFacebookToken();
    }
  }
}

// Fjern Facebook forbindelse
export async function disconnectFacebook() {
  const supabase = createClient();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: "No user found" };
    }

    // Find Facebook identity
    const facebookIdentity = user.identities?.find(
      (identity: any) => identity.provider === "facebook"
    );

    if (!facebookIdentity) {
      return { error: "No Facebook identity found" };
    }

    // Fjern token fra database
    const { error: tokenError } = await supabase
      .from("social_tokens")
      .delete()
      .eq("user_id", user.id)
      .eq("provider", "facebook");

    if (tokenError) {
      console.error("Error removing Facebook token:", tokenError);
    }

    // Unlink identity fra Supabase
    const { error: unlinkError } = await supabase.auth.unlinkIdentity(facebookIdentity);

    if (unlinkError) {
      console.error("Error unlinking Facebook identity:", unlinkError);
      return { error: unlinkError.message };
    }

    // Opdater store
    useAuthStore.getState().setFacebookLinked(false);
    useAuthStore.getState().clearFacebookToken();

    return { success: true };
  } catch (error) {
    console.error("Error in disconnectFacebook:", error);
    return { error: "Unexpected error" };
  }
}

// Tjek om Facebook token er gyldigt
export async function isValidFacebookToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/me?access_token=${token}`
    );
    const data = await response.json();
    
    // Hvis der er en error, er token ikke gyldigt
    return !data.error;
  } catch (error) {
    return false;
  }
}

// Test funktion til at verificere Facebook token
export async function testFacebookToken() {
  const token = useAuthStore.getState().facebookToken;

  if (!token) {
    console.log("No Facebook token available");
    return false;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/me?access_token=${token}`
    );
    const data = await response.json();

    if (data.error) {
      console.error("Facebook token error:", data.error);
      return false;
    } else {
      console.log("✅ Facebook token is valid:", data.name);
      return true;
    }
  } catch (error) {
    console.error("Error testing Facebook token:", error);
    return false;
  }
}
