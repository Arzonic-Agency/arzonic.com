"use client";

import { createClient } from "@/utils/supabase/client";
import { useAuthStore } from "./useAuthStore";
import { readUserSession } from "./readUserSession";

// Cache to prevent duplicate validation calls
let validationCache: { [key: string]: { result: any; timestamp: number } } = {};
let validationInProgress = false;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Henter ALT fra server og sætter i Zustand
export const fetchAndSetUserSession = async () => {
  try {
    const session = await readUserSession();
    if (!session) {
      useAuthStore.getState().clearSession();
      return;
    }

    const { user, role, facebookLinked, facebookToken } = session;
    const currentState = useAuthStore.getState();

    // Only update if values have actually changed to prevent unnecessary re-renders
    if (currentState.user?.id !== user.id) {
      useAuthStore.getState().setUser({ id: user.id, email: user.email });
    }
    if (currentState.role !== role) {
      useAuthStore.getState().setRole(role);
    }
    if (currentState.facebookLinked !== facebookLinked) {
      useAuthStore.getState().setFacebookLinked(facebookLinked);
    }
    if (currentState.facebookToken !== facebookToken) {
      useAuthStore.getState().setFacebookToken(facebookToken);
    }

    // Handle Facebook page access validation
    if (!facebookLinked) {
      if (currentState.facebookPageAccess !== false) {
        useAuthStore.getState().setFacebookPageAccess(false);
      }
      return;
    }

    // Only validate page access if Facebook is linked and we have a token
    if (facebookLinked && facebookToken) {
      await validateFacebookPageAccess(user.id);
    } else {
      // Facebook linked but no token - set to false
      if (currentState.facebookPageAccess !== false) {
        useAuthStore.getState().setFacebookPageAccess(false);
      }
    }
  } catch (err) {
    console.error("fetchAndSetUserSession failed:", err);
    useAuthStore.getState().clearSession();
  }
};

// Separate function for Facebook validation with caching
async function validateFacebookPageAccess(userId: string) {
  const cacheKey = `fb_validation_${userId}`;
  const now = Date.now();

  // Check cache first
  if (
    validationCache[cacheKey] &&
    now - validationCache[cacheKey].timestamp < CACHE_DURATION
  ) {
    console.log("🔍 [CLIENT] Using cached validation result");
    const validation = validationCache[cacheKey].result;
    const currentState = useAuthStore.getState();

    // Only update if different from current state
    if (
      currentState.facebookPageAccess !== validation.hasAccess ||
      currentState.facebookPageName !== validation.pageName
    ) {
      useAuthStore
        .getState()
        .setFacebookPageAccess(validation.hasAccess, validation.pageName);
    }
    return;
  }

  // Prevent multiple simultaneous validation calls
  if (validationInProgress) {
    console.log("🔍 [CLIENT] Validation already in progress, skipping");
    return;
  }

  validationInProgress = true;
  useAuthStore.getState().setFacebookValidating(true);

  try {
    console.log("🔍 [CLIENT] Starting Facebook page validation");
    const response = await fetch("/api/validate-facebook-page-after-auth", {
      method: "POST",
    });

    if (response.ok) {
      const validation = await response.json();
      console.log("🔍 [CLIENT] Page validation result:", validation);

      // Cache the result
      validationCache[cacheKey] = {
        result: validation,
        timestamp: now,
      };

      useAuthStore
        .getState()
        .setFacebookPageAccess(validation.hasAccess, validation.pageName);
    } else {
      console.error(
        "🔍 [CLIENT] Page validation failed - response not ok:",
        response.status
      );
      useAuthStore.getState().setFacebookPageAccess(false);
    }
  } catch (error) {
    console.error(
      "🔍 [CLIENT] Failed to validate Facebook page access:",
      error
    );
    useAuthStore.getState().setFacebookPageAccess(false);
  } finally {
    validationInProgress = false;
    useAuthStore.getState().setFacebookValidating(false);
  }
}

// Debounce function to prevent rapid successive calls
let authChangeTimeout: NodeJS.Timeout | null = null;
let lastAuthEvent: string | null = null;

// Lyt på *alle* Supabase-auth ændringer og gen-fetch
export function setupAuthListener() {
  const supabase = createClient();
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log("🔍 [CLIENT] Auth state change:", event);

    // Skip if it's the same event repeated
    if (lastAuthEvent === event) {
      console.log("🔍 [CLIENT] Duplicate auth event, skipping");
      return;
    }
    lastAuthEvent = event;

    // Clear previous timeout
    if (authChangeTimeout) {
      clearTimeout(authChangeTimeout);
    }

    // Only process certain events to reduce unnecessary calls
    const relevantEvents = [
      "SIGNED_IN",
      "SIGNED_OUT",
      "TOKEN_REFRESHED",
      "USER_UPDATED",
    ];
    if (!relevantEvents.includes(event)) {
      console.log("🔍 [CLIENT] Irrelevant auth event, skipping");
      return;
    }

    // Debounce the session fetch to prevent rapid successive calls
    authChangeTimeout = setTimeout(async () => {
      await fetchAndSetUserSession();
      lastAuthEvent = null; // Reset after processing
    }, 500); // Increased debounce to 500ms
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

  // Clear validation cache for this user
  const cacheKey = `fb_validation_${user.id}`;
  delete validationCache[cacheKey];

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
