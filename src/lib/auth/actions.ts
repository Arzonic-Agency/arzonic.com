"use server";

import {
  createAdminClient,
  createServerClientInstance,
} from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = await createServerClientInstance();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { success: false, message: "Wrong credentials" };
  } else {
    return { success: true };
  }
}

export async function signOut() {
  const supabase = await createServerClientInstance();

  await supabase.auth.signOut({ scope: "local" });

  revalidatePath("/", "layout");
  redirect("/login");
}

// ─────────────────────────────────────────────────────────────────────────────
// MEMBER CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

export async function createMember(data: {
  email: string;
  password: string;
  role: "editor" | "admin" | "developer";
  name: string;
}) {
  const supabase = await createAdminClient();

  try {
    if (!supabase.auth.admin) {
      throw new Error("REGISTRATION_ERROR");
    }

    const createResult = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        role: data.role,
      },
    });

    if (createResult.error) {
      const msg = createResult.error.message.toLowerCase();

      if (msg.includes("already") && msg.includes("registered")) {
        throw new Error("EMAIL_ALREADY_EXISTS");
      }

      if (msg.includes("not allowed")) {
        throw new Error("REGISTRATION_ERROR");
      }

      throw new Error("REGISTRATION_ERROR");
    }

    const userId = createResult.data.user?.id;
    if (!userId) {
      throw new Error("REGISTRATION_ERROR");
    }

    const memberResult = await supabase
      .from("members")
      .insert({ name: data.name, id: userId, role: data.role });

    if (memberResult.error) {
      console.error(
        "Failed to insert into members:",
        memberResult.error.message,
      );
      throw new Error("REGISTRATION_ERROR");
    }

    return createResult.data.user;
  } catch (err) {
    console.error("Unexpected error during member creation:", err);
    throw err;
  }
}

export async function updateMember(
  userId: string,
  data: {
    email?: string;
    password?: string;
    role?: "admin" | "editor" | "developer";
    name?: string;
  },
): Promise<void> {
  const supabase = await createAdminClient();

  try {
    const { error: authError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        email: data.email,
        password: data.password,
      },
    );

    if (authError) {
      throw new Error(`Failed to update user in auth: ${authError.message}`);
    }

    const memberPayload: Record<string, unknown> = {};
    if (data.name !== undefined) memberPayload.name = data.name;
    if (data.role !== undefined) memberPayload.role = data.role;

    if (Object.keys(memberPayload).length > 0) {
      const { error: memberError } = await supabase
        .from("members")
        .update(memberPayload)
        .eq("id", userId);

      if (memberError) {
        throw new Error(
          `Failed to update user in members: ${memberError.message}`,
        );
      }
    }
  } catch (error) {
    console.error("Error in updateUser:", error);
    throw error;
  }
}

export async function deleteMember(userId: string) {
  const supabase = await createAdminClient();

  try {
    const { error: deleteAuthError } =
      await supabase.auth.admin.deleteUser(userId);

    if (deleteAuthError) {
      console.error(
        "Failed to delete user from auth:",
        deleteAuthError.message,
      );
      throw new Error(
        "Failed to delete user from auth: " + deleteAuthError.message,
      );
    }

    console.log("User deleted from auth:", userId);

    const { error: deleteMemberError } = await supabase
      .from("members")
      .delete()
      .eq("id", userId);

    if (deleteMemberError) {
      console.error(
        "Failed to delete user from members:",
        deleteMemberError.message,
      );
      throw new Error(
        "Failed to delete user from members: " + deleteMemberError.message,
      );
    }

    console.log("User deleted from members:", userId);

    return { success: true };
  } catch (err) {
    console.error("Unexpected error during user deletion:", err);
    throw err;
  }
}

export async function getAllMembers() {
  const supabase = await createAdminClient();

  const {
    data: { users },
    error: fetchError,
  } = await supabase.auth.admin.listUsers();

  if (fetchError) {
    throw new Error("Failed to fetch users: " + fetchError.message);
  }

  const userIds = users.map((user) => user.id);

  const { data: members, error: membersError } = await supabase
    .from("members")
    .select("id, name, role")
    .in("id", userIds);

  if (membersError) {
    throw new Error("Failed to fetch members: " + membersError.message);
  }

  const usersWithRolesAndNames = users.map((user) => {
    const member = members.find((m) => m.id === user.id);
    return {
      ...user,
      role: member?.role ?? null,
      name: member?.name ?? null,
    };
  });

  return usersWithRolesAndNames || [];
}

// ─────────────────────────────────────────────────────────────────────────────
// User actions
// ─────────────────────────────────────────────────────────────────────────────

export async function changeOwnPassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; message?: string }> {
  const supabase = await createServerClientInstance();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Not authenticated");
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });

    if (signInError) {
      return {
        success: false,
        message: "Current password is incorrect",
      };
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      throw new Error(`Failed to update password: ${updateError.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error in changeOwnPassword:", error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "An unexpected error occurred" };
  }
}
