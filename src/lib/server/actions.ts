"use server";

import {
  createAdmin,
  createServerClientInstance,
} from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";

//REGISTER

export async function createMember(data: {
  email: string;
  password: string;
  role: "editor" | "admin";
  name: string;
}) {
  const supabase = await createAdmin();

  try {
    const createResult = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        role: data.role,
      },
    });

    if (createResult.error) {
      console.error("Failed to create user:", createResult.error.message);
      throw new Error("Failed to create user: " + createResult.error.message);
    }

    console.log("User created:", createResult.data.user);

    const memberResult = await supabase
      .from("members")
      .insert({ name: data.name, id: createResult.data.user?.id });

    if (memberResult.error) {
      console.error(
        "Failed to insert into members:",
        memberResult.error.message
      );
      throw new Error(
        "Failed to insert into members: " + memberResult.error.message
      );
    }

    console.log("Member inserted:", memberResult.data);

    const permissionsResult = await supabase
      .from("permissions")
      .insert({ role: data.role, member_id: createResult.data.user?.id });

    if (permissionsResult.error) {
      console.error(
        "Failed to insert into permissions:",
        permissionsResult.error.message
      );
      throw new Error(
        "Failed to insert into permissions: " + permissionsResult.error.message
      );
    }

    console.log("Permissions inserted:", permissionsResult.data);

    return createResult.data.user;
  } catch (err) {
    console.error("Unexpected error during member creation:", err);
    throw err;
  }
}

//LOGOUT

export async function signOut() {
  const supabase = await createServerClientInstance();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}

//USERS

export async function getAllUsers() {
  const supabase = await createAdmin();

  const {
    data: { users },
    error: fetchError,
  } = await supabase.auth.admin.listUsers();

  if (fetchError) {
    throw new Error("Failed to fetch users: " + fetchError.message);
  }

  const userIds = users.map((user) => user.id);
  const { data: permissions, error: permissionsError } = await supabase
    .from("permissions")
    .select("member_id, role")
    .in("member_id", userIds);

  if (permissionsError) {
    throw new Error("Failed to fetch permissions: " + permissionsError.message);
  }

  const { data: members, error: membersError } = await supabase
    .from("members")
    .select("id, name")
    .in("id", userIds);

  if (membersError) {
    throw new Error("Failed to fetch members: " + membersError.message);
  }

  const usersWithRolesAndNames = users.map((user) => {
    const userPermission = permissions.find(
      (permission) => permission.member_id === user.id
    );
    const userName = members.find((member) => member.id === user.id)?.name;
    return {
      ...user,
      role: userPermission ? userPermission.role : null,
      name: userName || null,
    };
  });

  return usersWithRolesAndNames || [];
}

export async function deleteUser(userId: string) {
  const supabase = await createAdmin();

  try {
    // Step 1: Delete user from Supabase Auth
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(
      userId
    );

    if (deleteAuthError) {
      console.error(
        "Failed to delete user from auth:",
        deleteAuthError.message
      );
      throw new Error(
        "Failed to delete user from auth: " + deleteAuthError.message
      );
    }

    console.log("User deleted from auth:", userId);

    // Step 2: Delete user from members table
    const { error: deleteMemberError } = await supabase
      .from("members")
      .delete()
      .eq("id", userId);

    if (deleteMemberError) {
      console.error(
        "Failed to delete user from members:",
        deleteMemberError.message
      );
      throw new Error(
        "Failed to delete user from members: " + deleteMemberError.message
      );
    }

    console.log("User deleted from members:", userId);

    // Step 3: Delete user from permissions table
    const { error: deletePermissionError } = await supabase
      .from("permissions")
      .delete()
      .eq("member_id", userId);

    if (deletePermissionError) {
      console.error(
        "Failed to delete user from permissions:",
        deletePermissionError.message
      );
      throw new Error(
        "Failed to delete user from permissions: " +
          deletePermissionError.message
      );
    }

    console.log("User deleted from permissions:", userId);

    return { success: true };
  } catch (err) {
    console.error("Unexpected error during user deletion:", err);
    throw err;
  }
}

// UPDATE USER

export async function updateUser(
  userId: string,
  data: { email?: string; password?: string; role?: string; name?: string }
): Promise<void> {
  const supabase = await createAdmin();

  try {
    // Update user in Supabase Auth
    const { error: authError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        email: data.email,
        password: data.password,
      }
    );

    if (authError) {
      throw new Error(`Failed to update user in auth: ${authError.message}`);
    }

    // Update user in members table
    const { error: memberError } = await supabase
      .from("members")
      .update({ name: data.name })
      .eq("id", userId);

    if (memberError) {
      throw new Error(
        `Failed to update user in members: ${memberError.message}`
      );
    }

    // Update user role in permissions table
    if (data.role) {
      const { error: permissionError } = await supabase
        .from("permissions")
        .update({ role: data.role })
        .eq("member_id", userId);

      if (permissionError) {
        throw new Error(
          `Failed to update user role: ${permissionError.message}`
        );
      }
    }
  } catch (error) {
    console.error("Error in updateUser:", error);
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CREATE CASE
// ─────────────────────────────────────────────────────────────────────────────

export async function createCase({
  companyName,
  desc,
  city,
  country,
  contactPerson,
  image,
}: {
  companyName: string;
  desc: string;
  city: string;
  country: string;
  contactPerson: string;
  image?: File;
}): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    const apiKey = process.env.DEEPL_API_KEY!;
    const endpoint = "https://api-free.deepl.com/v2/translate";

    const params1 = new URLSearchParams({
      auth_key: apiKey,
      text: desc,
      target_lang: "EN",
    });
    const r1 = await fetch(endpoint, { method: "POST", body: params1 });
    if (!r1.ok) throw new Error(`DeepL error ${r1.status}: ${await r1.text()}`);
    const {
      translations: [first],
    } = (await r1.json()) as {
      translations: { text: string; detected_source_language: string }[];
    };
    const sourceLang = first.detected_source_language.toLowerCase();

    let desc_translated = first.text;
    if (sourceLang === "en") {
      const params2 = new URLSearchParams({
        auth_key: apiKey,
        text: desc,
        target_lang: "DA",
      });
      const r2 = await fetch(endpoint, { method: "POST", body: params2 });
      if (!r2.ok)
        throw new Error(`DeepL error ${r2.status}: ${await r2.text()}`);
      const {
        translations: [second],
      } = (await r2.json()) as {
        translations: { text: string }[];
      };
      desc_translated = second.text;
    }

    const countryParams = new URLSearchParams({
      auth_key: apiKey,
      text: country,
      target_lang: "EN",
    });
    const countryRes = await fetch(endpoint, {
      method: "POST",
      body: countryParams,
    });
    if (!countryRes.ok) {
      throw new Error(
        `DeepL country error ${countryRes.status}: ${await countryRes.text()}`
      );
    }
    const {
      translations: [countryFirst],
    } = (await countryRes.json()) as {
      translations: { text: string }[];
    };
    const country_translated = countryFirst.text;

    let imageUrl: string | null = null;
    if (image) {
      const uploadFile = async (file: File) => {
        const ext = "webp";
        const name = `${Math.random().toString(36).slice(2)}.${ext}`;
        const { data: ud, error: ue } = await supabase.auth.getUser();
        if (ue || !ud?.user) throw new Error("Not authenticated");
        const path = `case-images/${ud.user.id}/${name}`;
        const buf = await sharp(Buffer.from(await file.arrayBuffer()))
          .rotate()
          .resize({ width: 1024, height: 768, fit: "cover" })
          .webp({ quality: 65 })
          .toBuffer();
        await supabase.storage.from("case-images").upload(path, buf, {
          contentType: "image/webp",
        });
        const { data } = await supabase.storage
          .from("case-images")
          .getPublicUrl(path);
        return data.publicUrl!;
      };
      imageUrl = await uploadFile(image);
    }

    const { data: ud, error: ue } = await supabase.auth.getUser();
    if (ue || !ud?.user) throw new Error("Not authenticated");

    const { error } = await supabase.from("cases").insert([
      {
        companyName,
        desc,
        desc_translated,
        source_lang: sourceLang,
        city,
        country,
        country_translated,
        contactPerson,
        image: imageUrl,
        creator_id: ud.user.id,
      },
    ]);
    if (error) throw error;
  } catch (err) {
    console.error("createCase error:", err);
    throw err;
  }
}

export async function updateCase(
  id: number,
  companyName: string,
  desc: string,
  city: string,
  country: string,
  contactPerson: string,
  image: File | null,
  created_at?: string
): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    const apiKey = process.env.DEEPL_API_KEY!;
    const endpoint = "https://api-free.deepl.com/v2/translate";

    const params1 = new URLSearchParams({
      auth_key: apiKey,
      text: desc,
      target_lang: "EN",
    });
    const r1 = await fetch(endpoint, { method: "POST", body: params1 });
    if (!r1.ok) throw new Error(`DeepL error ${r1.status}: ${await r1.text()}`);
    const {
      translations: [first],
    } = (await r1.json()) as {
      translations: { text: string; detected_source_language: string }[];
    };
    const sourceLang = first.detected_source_language.toLowerCase();

    let desc_translated = first.text;
    if (sourceLang === "en") {
      const params2 = new URLSearchParams({
        auth_key: apiKey,
        text: desc,
        target_lang: "DA",
      });
      const r2 = await fetch(endpoint, { method: "POST", body: params2 });
      if (!r2.ok)
        throw new Error(`DeepL error ${r2.status}: ${await r2.text()}`);
      const {
        translations: [second],
      } = (await r2.json()) as {
        translations: { text: string }[];
      };
      desc_translated = second.text;
    }

    const countryParams = new URLSearchParams({
      auth_key: apiKey,
      text: country,
      target_lang: "EN",
    });
    const countryRes = await fetch(endpoint, {
      method: "POST",
      body: countryParams,
    });
    if (!countryRes.ok) {
      throw new Error(
        `DeepL country error ${countryRes.status}: ${await countryRes.text()}`
      );
    }
    const {
      translations: [countryFirst],
    } = (await countryRes.json()) as {
      translations: { text: string }[];
    };
    const country_translated = countryFirst.text;

    let imageUrl: string | null = null;
    if (image) {
      const uploadFile = async (file: File) => {
        const ext = "webp";
        const name = `${Math.random().toString(36).slice(2)}.${ext}`;
        const { data: ud, error: ue } = await supabase.auth.getUser();
        if (ue || !ud?.user) throw new Error("Not authenticated");
        const path = `case-images/${ud.user.id}/${name}`;
        const buf = await sharp(Buffer.from(await file.arrayBuffer()))
          .rotate()
          .resize({ width: 1024, height: 768, fit: "cover" })
          .webp({ quality: 65 })
          .toBuffer();
        await supabase.storage.from("case-images").upload(path, buf, {
          contentType: "image/webp",
        });
        const { data } = await supabase.storage
          .from("case-images")
          .getPublicUrl(path);
        return data.publicUrl!;
      };
      imageUrl = await uploadFile(image);
    } else {
      const { data: existing } = await supabase
        .from("cases")
        .select("image")
        .eq("id", id)
        .single();
      imageUrl = existing?.image ?? null;
    }

    const { data: ud, error: ue } = await supabase.auth.getUser();
    if (ue || !ud?.user) throw new Error("Not authenticated");

    const payload: {
      companyName: string;
      desc: string;
      desc_translated: string;
      source_lang: string;
      city: string;
      country: string;
      country_translated: string;
      contactPerson: string;
      image: string | null;
      creator_id: string;
      created_at?: string;
    } = {
      companyName,
      desc,
      desc_translated,
      source_lang: sourceLang,
      city,
      country,
      country_translated,
      contactPerson,
      image: imageUrl,
      creator_id: ud.user.id,
      ...(created_at ? { created_at } : {}),
    };
    if (created_at) payload.created_at = created_at;

    const { error } = await supabase.from("cases").update(payload).eq("id", id);
    if (error) throw error;
  } catch (err) {
    console.error("updateCase error:", err);
    throw err;
  }
}

export async function getAllCases(page = 1, limit = 6) {
  const supabase = await createServerClientInstance();
  const offset = (page - 1) * limit;
  const { data, count, error } = await supabase
    .from("cases")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw new Error(error.message);
  return { cases: data, total: count ?? 0 };
}

export async function getCaseById(caseId: number) {
  const supabase = await createServerClientInstance();
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("id", caseId)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteCase(caseId: number): Promise<void> {
  const supabase = await createServerClientInstance();
  const { error } = await supabase.from("cases").delete().eq("id", caseId);
  if (error) throw new Error(error.message);
}

// REVIEWS

const DEEPL_ENDPOINT = "https://api-free.deepl.com/v2/translate";

async function detectAndTranslate(text: string) {
  const apiKey = process.env.DEEPL_API_KEY!;
  const p1 = new URLSearchParams({ auth_key: apiKey, text, target_lang: "EN" });
  const r1 = await fetch(DEEPL_ENDPOINT, { method: "POST", body: p1 });
  if (!r1.ok) throw new Error(`DeepL error ${r1.status}: ${await r1.text()}`);
  const {
    translations: [first],
  } = (await r1.json()) as {
    translations: { text: string; detected_source_language: string }[];
  };

  const sourceLang = first.detected_source_language.toLowerCase(); // "en" or "da"
  let translated = first.text;

  if (sourceLang === "en") {
    const p2 = new URLSearchParams({
      auth_key: apiKey,
      text,
      target_lang: "DA",
    });
    const r2 = await fetch(DEEPL_ENDPOINT, { method: "POST", body: p2 });
    if (!r2.ok) throw new Error(`DeepL error ${r2.status}: ${await r2.text()}`);
    const {
      translations: [second],
    } = (await r2.json()) as {
      translations: { text: string }[];
    };
    translated = second.text;
  }

  return { sourceLang, translated };
}

export async function createReview(
  desc: string,
  rate: number,
  companyName: string,
  contactPerson: string
): Promise<void> {
  const supabase = await createServerClientInstance();
  const { sourceLang, translated } = await detectAndTranslate(desc);
  const { data: u, error: ue } = await supabase.auth.getUser();
  if (ue || !u?.user) throw new Error("Not authenticated");

  const { error } = await supabase.from("reviews").insert([
    {
      creator: u.user.id,
      desc,
      desc_translated: translated,
      source_lang: sourceLang,
      rate,
      companyName,
      contactPerson,
    },
  ]);

  if (error) throw error;
}

export async function getAllReviews(page = 1, limit = 6) {
  const supabase = await createServerClientInstance();
  const offset = (page - 1) * limit;
  const { data, count, error } = await supabase
    .from("reviews")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw new Error(error.message);
  return { reviews: data, total: count ?? 0 };
}

export async function deleteReview(reviewId: number): Promise<void> {
  const supabase = await createServerClientInstance();
  const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
  if (error) throw new Error(error.message);
}

export async function getLatestReviews(limit: number = 10) {
  const supabase = await createServerClientInstance();

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch latest reviews: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error("Unexpected error during fetching latest reviews:", err);
    throw err;
  }
}

export async function updateReview(
  reviewId: number,
  companyName: string,
  contactPerson: string,
  desc: string,
  rate: number
): Promise<void> {
  const supabase = await createServerClientInstance();
  const { sourceLang, translated } = await detectAndTranslate(desc);
  const { data: u, error: ue } = await supabase.auth.getUser();
  if (ue || !u?.user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("reviews")
    .update({
      desc,
      desc_translated: translated,
      source_lang: sourceLang,
      rate,
      companyName,
      contactPerson,
      creator: u.user.id,
    })
    .eq("id", reviewId);

  if (error) throw error;
}

export async function getReviewById(reviewId: number) {
  const supabase = await createServerClientInstance();

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("id", reviewId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch review by ID: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error("Unexpected error during fetching review by ID:", err);
    throw err;
  }
}

// REQUESTS

export async function getAllRequests(page: number = 1, limit: number = 6) {
  const supabase = await createServerClientInstance();
  const offset = (page - 1) * limit;

  try {
    const { data, count, error } = await supabase
      .from("requests")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch requests: ${error.message}`);
    }

    return { requests: data, total: count || 0 };
  } catch (err) {
    console.error("Unexpected error during fetching requests:", err);
    throw err;
  }
}

export async function deleteRequest(requestId: string): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    const { error } = await supabase
      .from("requests")
      .delete()
      .eq("id", requestId);

    if (error) {
      throw new Error(`Failed to delete request: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in deleteRequest:", error);
    throw error;
  }
}

export async function updateRequest(
  requestId: string,
  data: {
    name?: string;
    company?: string;
    category?: string;
    mobile?: string;
    mail?: string;
    message?: string;
    address?: string;
    city?: string;
  }
): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    const { error } = await supabase
      .from("requests")
      .update(data)
      .eq("id", requestId);

    if (error) {
      throw new Error(`Failed to update request: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in updateRequest:", error);
    throw error;
  }
}

export async function getRequestById(requestId: string) {
  const supabase = await createServerClientInstance();

  try {
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch request by ID: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error("Unexpected error during fetching request by ID:", err);
    throw err;
  }
}

// REQUEST NOTES

export async function createRequestNote(
  message: string,
  requestId: string
): Promise<{ id: string; message: string; created_at: string }> {
  const supabase = await createServerClientInstance();

  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("notes")
      .insert([
        {
          message: message,
          request_id: requestId,
          creator: userData.user.id,
        },
      ])
      .select("*")
      .single();

    if (error) {
      throw new Error(`Failed to create request note: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in createRequestNote:", error);
    throw error;
  }
}

export async function getNotesByRequestId(requestId: string) {
  const supabase = await createServerClientInstance();

  try {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("request_id", requestId);

    if (error) {
      throw new Error(`Failed to fetch notes: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error("Unexpected error during fetching notes:", err);
    throw err;
  }
}

export async function deleteRequestNote(noteId: string): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    const { error } = await supabase.from("notes").delete().eq("id", noteId);

    if (error) {
      throw new Error(`Failed to delete request note: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in deleteRequestNote:", error);
    throw error;
  }
}

export async function getPackages() {
  const supabase = await createServerClientInstance();

  try {
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .order("priceEUR", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch packs: ${error.message}`);
    }

    return { packs: data || [] };
  } catch (err) {
    console.error("Unexpected error during fetching packs:", err);
    throw err;
  }
}

export async function getServices() {
  const supabase = await createServerClientInstance();

  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("label", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch services: ${error.message}`);
    }

    return { services: data || [] };
  } catch (err) {
    console.error("Unexpected error during fetching services:", err);
    throw err;
  }
}

export async function updatePackage(
  packageId: string,
  data: { label?: string; price?: number }
): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    const { error } = await supabase
      .from("packages")
      .update(data)
      .eq("id", packageId);

    if (error) {
      throw new Error(`Failed to update package: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in updatePackage:", error);
    throw error;
  }
}

export async function createContactRequest(
  name: string,
  email: string,
  country: string,
  mobile: string,
  answers: { questionId: number; optionIds: number[] }[]
): Promise<{ requestId: string }> {
  const supabase = await createServerClientInstance();

  const { data: request, error: reqErr } = await supabase
    .from("requests")
    .insert({ name, mail: email, country, mobile })
    .select("id")
    .single();

  if (reqErr || !request) {
    throw new Error("Failed to create request: " + reqErr?.message);
  }
  const requestId = request.id;

  const { error: respErr } = await supabase
    .from("responses")
    .insert({ request_id: requestId, answers });

  if (respErr) {
    throw new Error("Failed to save responses: " + respErr.message);
  }

  return { requestId };
}

export type EstimatorQuestion = {
  id: number;
  text: string;
  type: "single" | "multiple";
  options: { id: number; text: string }[];
};

export async function getEstimatorQuestions(): Promise<EstimatorQuestion[]> {
  const supabase = await createServerClientInstance();

  const { data, error } = await supabase
    .from("questions")
    .select("id, text, type, options(id, text)")
    .order("id", { ascending: true });

  if (error) {
    console.error("Failed to fetch estimator questions:", error.message);
    throw new Error("Failed to fetch questions: " + error.message);
  }

  return (data || []).map(
    (q: {
      id: number;
      text: string;
      type: string;
      options: { id: number; text: string }[];
    }) => ({
      id: q.id,
      text: q.text,
      type: q.type as "single" | "multiple",
      options: q.options.map((o: { id: number; text: string }) => ({
        id: o.id,
        text: o.text,
      })),
    })
  );
}
