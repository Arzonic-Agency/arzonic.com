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

  const { data: roleResult, error: roleError } = await supabase
    .from("permissions")
    .select("role")
    .eq("member_id", user.id)
    .single();
  if (roleError || !roleResult) return null;

  const facebookLinked = (user.identities as Identity[]).some(
    (i) => i.provider === "facebook"
  );

  let facebookToken: string | null = null;
  if (facebookLinked) {
    const {
      data: { session },
    } = await supabase.auth.getSession(); // kun til token
    facebookToken = session?.provider_token ?? null;
  }

  return {
    user,
    role: roleResult.role as "admin" | "editor" | "developer",
    facebookLinked,
    facebookToken,
  };
}
