"use server";

import {
  createServerClientInstance,
  createAdminClient,
} from "@/utils/supabase/server";

export type Session = {
  id: string;
  user_agent: string | null;
  ip: string | null;
  created_at: string;
  updated_at: string | null;
  not_after: string | null;
  is_current: boolean;
};

export async function readUserSession() {
  const supabase = await createServerClientInstance();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return null;

  const { data: memberResult, error: memberError } = await supabase
    .from("members")
    .select("name, role")
    .eq("id", user.id)
    .single();
  if (memberError || !memberResult) return null;
  const { name, role } = memberResult;

  return {
    user,
    role: role as "admin" | "editor" | "developer",
    name,
  };
}

export async function checkIsAdminOrDeveloper() {
  try {
    const supabase = await createServerClientInstance();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { isAuthorized: false, userId: null };
    }

    const { data: member, error: memberError } = await supabase
      .from("members")
      .select("role")
      .eq("id", user.id)
      .single();

    if (memberError || !member) {
      return { isAuthorized: false, userId: null };
    }

    const isAuthorized = ["admin", "developer"].includes(member.role);

    return { isAuthorized, userId: user.id };
  } catch (error) {
    console.error("Fejl ved tjek af admin/developer rolle:", error);
    return { isAuthorized: false, userId: null };
  }
}

export async function fetchAndSetUserSession() {
  try {
    const { useAuthStore } = await import("./useAuthStore");
    const session = await readUserSession();

    if (!session) {
      useAuthStore.getState().clearSession();
      return;
    }

    const { user, role } = session;
    useAuthStore.getState().setUser({ id: user.id, email: user.email });
    useAuthStore.getState().setRole(role);
  } catch (err) {
    console.error("fetchAndSetUserSession failed:", err);
    const { useAuthStore } = await import("./useAuthStore");
    useAuthStore.getState().clearSession();
  }
}

export async function getActiveSessions() {
  const supabase = await createAdminClient();

  try {
    const userSupabase = await createServerClientInstance();
    const {
      data: { user },
      error: userError,
    } = await userSupabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Ikke autentificeret" };
    }

    const {
      data: { session: currentSession },
    } = await userSupabase.auth.getSession();

    let currentSessionId: string | null = null;
    if (currentSession?.access_token) {
      try {
        const payloadBase64 = currentSession.access_token.split(".")[1];
        const payloadJson = Buffer.from(payloadBase64, "base64url").toString(
          "utf-8",
        );
        const payload = JSON.parse(payloadJson);
        currentSessionId = payload.session_id;
      } catch (e) {
        console.error("Failed to decode session ID from JWT:", e);
      }
    }

    const { data: authSessions, error: sessionsError } = await supabase.rpc(
      "get_user_sessions",
      { target_user_id: user.id },
    );

    if (sessionsError) {
      return { success: false, error: sessionsError.message };
    }

    const sessions: Session[] = (authSessions || []).map((session) => ({
      id: session.id,
      user_agent: session.user_agent,
      ip: session.ip,
      created_at: session.created_at,
      updated_at: session.updated_at,
      not_after: session.not_after,
      is_current: currentSessionId ? session.id === currentSessionId : false,
    }));

    return { success: true, sessions };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Ukendt fejl",
    };
  }
}

export async function revokeSession(sessionId: string) {
  const adminSupabase = await createAdminClient();

  try {
    const userSupabase = await createServerClientInstance();
    const {
      data: { user },
      error: userError,
    } = await userSupabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Ikke autentificeret" };
    }

    const { error } = await adminSupabase.rpc("delete_user_session", {
      target_user_id: user.id,
      target_session_id: sessionId,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Ukendt fejl",
    };
  }
}

export async function revokeAllOtherSessions() {
  const adminSupabase = await createAdminClient();

  try {
    const userSupabase = await createServerClientInstance();
    const {
      data: { user },
      error: userError,
    } = await userSupabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Ikke autentificeret" };
    }

    const {
      data: { session: currentSession },
    } = await userSupabase.auth.getSession();

    let currentSessionId: string | null = null;
    if (currentSession?.access_token) {
      try {
        const payload = JSON.parse(
          atob(currentSession.access_token.split(".")[1]),
        );
        currentSessionId = payload.session_id;
      } catch (e) {
        console.error("Failed to decode session ID from JWT:", e);
        return {
          success: false,
          error: "Kunne ikke identificere nuværende session",
        };
      }
    }

    if (!currentSessionId) {
      return {
        success: false,
        error: "Kunne ikke identificere nuværende session",
      };
    }

    const { data: authSessions, error: sessionsError } =
      await adminSupabase.rpc("get_user_sessions", { target_user_id: user.id });

    if (sessionsError) {
      return { success: false, error: sessionsError.message };
    }

    const sessionsToRevoke = (authSessions || []).filter(
      (session: { id: string }) => session.id !== currentSessionId,
    );

    if (sessionsToRevoke.length === 0) {
      return { success: true, count: 0 };
    }

    let revokedCount = 0;
    for (const session of sessionsToRevoke) {
      const { error } = await adminSupabase.rpc("delete_user_session", {
        target_user_id: user.id,
        target_session_id: session.id,
      });
      if (!error) {
        revokedCount++;
      }
    }

    return { success: true, count: revokedCount };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Ukendt fejl",
    };
  }
}
