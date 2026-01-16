"use server";

import { createServerClientInstance } from "@/utils/supabase/server";

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

// Client-side function to fetch and set user session in Zustand store
export async function fetchAndSetUserSession() {
  "use client";

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
