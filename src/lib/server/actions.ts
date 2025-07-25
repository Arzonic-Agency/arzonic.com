"use server";

import {
  createAdminClient,
  createServerClientInstance,
} from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { postToFacebookPage } from "./some";

// ─────────────────────────────────────────────────────────────────────────────
// AUTHENTICATION
// ─────────────────────────────────────────────────────────────────────────────

export async function login(formData: FormData) {
  const supabase = await createServerClientInstance();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // Return a generic error message
    return { success: false, message: "Wrong credentials" };
  } else {
    return { success: true };
  }
}

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
      .insert({ name: data.name, id: userId });

    if (memberResult.error) {
      console.error(
        "Failed to insert into members:",
        memberResult.error.message
      );
      throw new Error("REGISTRATION_ERROR");
    }

    const permissionsResult = await supabase
      .from("permissions")
      .insert({ role: data.role, member_id: userId });

    if (permissionsResult.error) {
      console.error(
        "Failed to insert into permissions:",
        permissionsResult.error.message
      );
      throw new Error("REGISTRATION_ERROR");
    }

    return createResult.data.user;
  } catch (err) {
    console.error("Unexpected error during member creation:", err);
    throw err;
  }
}

export async function signOut() {
  const supabase = await createServerClientInstance();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}

// ─────────────────────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllUsers() {
  const supabase = await createAdminClient();

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
  const supabase = await createAdminClient();

  try {
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

export async function updateUser(
  userId: string,
  data: { email?: string; password?: string; role?: string; name?: string }
): Promise<void> {
  const supabase = await createAdminClient();

  try {
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

    const { error: memberError } = await supabase
      .from("members")
      .update({ name: data.name })
      .eq("id", userId);

    if (memberError) {
      throw new Error(
        `Failed to update user in members: ${memberError.message}`
      );
    }

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
// CASES
// ─────────────────────────────────────────────────────────────────────────────

export async function createCase({
  company,
  desc,
  city,
  country,
  contact,
  image,
  website,
}: {
  company: string;
  desc: string;
  city: string;
  country: string;
  contact: string;
  image?: File;
  website?: string;
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
        company,
        desc,
        desc_translated,
        source_lang: sourceLang,
        city,
        country,
        country_translated,
        contact,
        image: imageUrl,
        creator_id: ud.user.id,
        website,
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
  company: string,
  desc: string,
  city: string,
  country: string,
  contact: string,
  image: File | null,
  created_at?: string,
  website?: string
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
      company: string;
      desc: string;
      desc_translated: string;
      source_lang: string;
      city: string;
      country: string;
      country_translated: string;
      contact: string;
      image: string | null;
      creator_id: string;
      created_at?: string;
      website?: string;
    } = {
      company,
      desc,
      desc_translated,
      source_lang: sourceLang,
      city,
      country,
      country_translated,
      contact,
      image: imageUrl,
      creator_id: ud.user.id,
      website,
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

// ─────────────────────────────────────────────────────────────────────────────
// NEWS
// ─────────────────────────────────────────────────────────────────────────────

export async function createNews({
  title,
  content,
  images,
  sharedFacebook = false,
}: {
  title: string;
  content: string;
  images?: File[];
  sharedFacebook?: boolean;
}): Promise<{ linkFacebook?: string }> {
  const supabase = await createServerClientInstance();
  const apiKey = process.env.DEEPL_API_KEY!;
  const endpoint = "https://api-free.deepl.com/v2/translate";

  // Validate Facebook page access FIRST if sharing is requested - before ANY operations
  if (sharedFacebook) {
    const { validateFacebookPageAccess } = await import("./some");
    const validationResult = await validateFacebookPageAccess();

    if (!validationResult.hasAccess) {
      throw new Error(
        validationResult.error ||
          "Ingen adgang til Facebook siden. Du skal være admin/editor på den krævede Facebook side for at kunne dele opslag."
      );
    }
  }

  // Skip title translation if empty to save API calls
  let title_translated = title;
  let titleSourceLang = "da"; // Default assumption

  if (title.trim()) {
    const titleParams = new URLSearchParams({
      auth_key: apiKey,
      text: title,
      target_lang: "EN",
    });
    const titleRes = await fetch(endpoint, {
      method: "POST",
      body: titleParams,
    });
    if (!titleRes.ok)
      throw new Error(
        `DeepL error ${titleRes.status}: ${await titleRes.text()}`
      );
    const {
      translations: [titleFirst],
    } = (await titleRes.json()) as {
      translations: { text: string; detected_source_language: string }[];
    };
    titleSourceLang = titleFirst.detected_source_language.toLowerCase();

    title_translated = titleFirst.text;
    if (titleSourceLang === "en") {
      const titleParams2 = new URLSearchParams({
        auth_key: apiKey,
        text: title,
        target_lang: "DA",
      });
      const titleR2 = await fetch(endpoint, {
        method: "POST",
        body: titleParams2,
      });
      if (!titleR2.ok)
        throw new Error(
          `DeepL error ${titleR2.status}: ${await titleR2.text()}`
        );
      const {
        translations: [titleSecond],
      } = (await titleR2.json()) as {
        translations: { text: string }[];
      };
      title_translated = titleSecond.text;
    }
  }

  // Translate content
  const params1 = new URLSearchParams({
    auth_key: apiKey,
    text: content,
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

  let content_translated = first.text;
  if (sourceLang === "en") {
    const params2 = new URLSearchParams({
      auth_key: apiKey,
      text: content,
      target_lang: "DA",
    });
    const r2 = await fetch(endpoint, { method: "POST", body: params2 });
    if (!r2.ok) throw new Error(`DeepL error ${r2.status}: ${await r2.text()}`);
    const {
      translations: [second],
    } = (await r2.json()) as {
      translations: { text: string }[];
    };
    content_translated = second.text;
  }

  const { data: ud, error: ue } = await supabase.auth.getUser();
  if (ue || !ud?.user) throw new Error("Not authenticated");

  const { data: newsData, error: insertError } = await supabase
    .from("news")
    .insert([
      {
        title,
        title_translated,
        content,
        content_translated,
        source_lang: sourceLang,
        creator_id: ud.user.id,
      },
    ])
    .select("id")
    .single();
  if (insertError || !newsData?.id) throw insertError;

  // Upload images and collect URLs - only after news is created
  const imageUrls: string[] = [];
  if (images?.length) {
    await Promise.all(
      images.map(async (file, index) => {
        const ext = "webp";
        const name = `${Math.random().toString(36).slice(2)}.${ext}`;
        const path = `${ud.user.id}/${name}`;
        const buf = await sharp(Buffer.from(await file.arrayBuffer()))
          .rotate()
          .resize({ width: 1024, height: 768, fit: "cover" })
          .webp({ quality: 65 })
          .toBuffer();
        await supabase.storage.from("news-images").upload(path, buf, {
          contentType: "image/webp",
        });

        // Get public URL for Facebook posting
        const { data: publicUrlData } = supabase.storage
          .from("news-images")
          .getPublicUrl(path);
        imageUrls.push(publicUrlData.publicUrl);

        await supabase.from("news_images").insert({
          news_id: newsData.id,
          path,
          sort_order: index,
        });
      })
    );
  }

  let fbResult: { link?: string } | null = null;

  // Post to Facebook only if requested (validation already passed)
  if (sharedFacebook) {
    try {
      const fbMessage = `${title}\n\n${content}`;
      // No skipValidation parameter - just call normally since we validated earlier
      fbResult = await postToFacebookPage({
        message: fbMessage,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      });

      if (fbResult?.link) {
        await supabase
          .from("news")
          .update({
            linkFacebook: fbResult.link,
            sharedFacebook: true,
          })
          .eq("id", newsData.id);
      }
    } catch (error) {
      console.error("Failed to post to Facebook:", error);
      // Clean up: delete the created news since Facebook posting failed
      await supabase.from("news").delete().eq("id", newsData.id);

      // Also delete uploaded images
      if (imageUrls.length > 0) {
        const imagePaths = imageUrls
          .map((url) => {
            const pathMatch = url.match(/news-images\/(.+)$/);
            return pathMatch ? pathMatch[1] : null;
          })
          .filter(Boolean);

        if (imagePaths.length > 0) {
          await supabase.storage.from("news-images").remove(imagePaths);
        }
      }

      throw error;
    }
  }

  return { linkFacebook: fbResult?.link };
}

export async function updateNews(
  id: number,
  title: string,
  content: string,
  images?: File[]
): Promise<void> {
  const supabase = await createServerClientInstance();
  const apiKey = process.env.DEEPL_API_KEY!;
  const endpoint = "https://api-free.deepl.com/v2/translate";

  // Translate title
  const titleParams = new URLSearchParams({
    auth_key: apiKey,
    text: title,
    target_lang: "EN",
  });
  const titleRes = await fetch(endpoint, { method: "POST", body: titleParams });
  if (!titleRes.ok)
    throw new Error(`DeepL error ${titleRes.status}: ${await titleRes.text()}`);
  const {
    translations: [titleFirst],
  } = (await titleRes.json()) as {
    translations: { text: string; detected_source_language: string }[];
  };
  const titleSourceLang = titleFirst.detected_source_language.toLowerCase();

  let title_translated = titleFirst.text;
  if (titleSourceLang === "en") {
    const titleParams2 = new URLSearchParams({
      auth_key: apiKey,
      text: title,
      target_lang: "DA",
    });
    const titleR2 = await fetch(endpoint, {
      method: "POST",
      body: titleParams2,
    });
    if (!titleR2.ok)
      throw new Error(`DeepL error ${titleR2.status}: ${await titleR2.text()}`);
    const {
      translations: [titleSecond],
    } = (await titleR2.json()) as {
      translations: { text: string }[];
    };
    title_translated = titleSecond.text;
  }

  // Translate content
  const params1 = new URLSearchParams({
    auth_key: apiKey,
    text: content,
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

  let content_translated = first.text;
  if (sourceLang === "en") {
    const params2 = new URLSearchParams({
      auth_key: apiKey,
      text: content,
      target_lang: "DA",
    });
    const r2 = await fetch(endpoint, { method: "POST", body: params2 });
    if (!r2.ok) throw new Error(`DeepL error ${r2.status}: ${await r2.text()}`);
    const {
      translations: [second],
    } = (await r2.json()) as {
      translations: { text: string }[];
    };
    content_translated = second.text;
  }

  const { data: ud, error: ue } = await supabase.auth.getUser();
  if (ue || !ud?.user) throw new Error("Not authenticated");

  const { error: updateError } = await supabase
    .from("news")
    .update({
      title,
      title_translated,
      content,
      content_translated,
      source_lang: sourceLang,
      creator_id: ud.user.id,
    })
    .eq("id", id);
  if (updateError) throw updateError;

  // Handle Facebook update automatically if post exists
  const { data: newsData } = await supabase
    .from("news")
    .select("linkFacebook")
    .eq("id", id)
    .single();

  if (newsData?.linkFacebook) {
    try {
      // Extract post ID from Facebook link
      const postId = newsData.linkFacebook.split("/").pop();
      if (postId) {
        const { updateFacebookPost } = await import("./some");
        await updateFacebookPost({
          postId,
          message: `${title}\n\n${content}`,
        });
      }
    } catch (error) {
      console.error("Failed to update Facebook post:", error);
      // Don't throw error here - news is updated, just Facebook update failed
    }
  }

  if (images?.length) {
    await Promise.all(
      images.map(async (file, index) => {
        const ext = "webp";
        const name = `${Math.random().toString(36).slice(2)}.${ext}`;
        const path = `${ud.user.id}/${name}`;
        const buf = await sharp(Buffer.from(await file.arrayBuffer()))
          .rotate()
          .resize({ width: 1024, height: 768, fit: "cover" })
          .webp({ quality: 65 })
          .toBuffer();
        await supabase.storage.from("news-images").upload(path, buf, {
          contentType: "image/webp",
        });
        await supabase.from("news_images").insert({
          news_id: id,
          path,
          sort_order: index,
        });
      })
    );
  }
}

interface NewsImage {
  path: string;
  sort_order: number;
}

export async function getAllNews(page = 1, limit = 6) {
  const supabase = await createServerClientInstance();
  const offset = (page - 1) * limit;
  const { data, count, error } = await supabase
    .from("news")
    .select("*, news_images(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw new Error(error.message);

  // Transform data to include image URLs
  const transformedNews =
    data?.map((newsItem) => {
      const images =
        (newsItem.news_images as NewsImage[] | undefined)
          ?.sort((a, b) => a.sort_order - b.sort_order)
          ?.map((img) => {
            const { data: publicUrlData } = supabase.storage
              .from("news-images")
              .getPublicUrl(img.path);
            return publicUrlData.publicUrl;
          }) || [];

      return {
        ...newsItem,
        images,
      };
    }) || [];

  return { news: transformedNews, total: count ?? 0 };
}

export async function getNewsById(newsId: number) {
  const supabase = await createServerClientInstance();
  const { data, error } = await supabase
    .from("news")
    .select("*, news_images(*)")
    .eq("id", newsId)
    .single();
  if (error) throw new Error(error.message);

  // Transform data to include image URLs
  const images =
    (data.news_images as NewsImage[] | undefined)
      ?.sort((a, b) => a.sort_order - b.sort_order)
      ?.map((img) => {
        const { data: publicUrlData } = supabase.storage
          .from("news-images")
          .getPublicUrl(img.path);
        return publicUrlData.publicUrl;
      }) || [];

  return {
    ...data,
    images,
  };
}

export async function deleteNews(newsId: number): Promise<void> {
  const supabase = await createServerClientInstance();

  // Get news data before deletion to check for Facebook post
  const { data: newsData } = await supabase
    .from("news")
    .select("linkFacebook")
    .eq("id", newsId)
    .single();

  // Delete Facebook post if it exists
  if (newsData?.linkFacebook) {
    try {
      const postId = newsData.linkFacebook.split("/").pop();
      if (postId) {
        const { deleteFacebookPost } = await import("./some");
        await deleteFacebookPost(postId);
      }
    } catch (error) {
      console.error("Failed to delete Facebook post:", error);
      // Continue with news deletion even if Facebook deletion fails
    }
  }

  // 1. Hent alle billeder tilknyttet nyheden
  const { data: images, error: imagesError } = await supabase
    .from("news_images")
    .select("path")
    .eq("news_id", newsId);
  if (imagesError) throw new Error(imagesError.message);

  // 2. Slet billeder fra storage
  if (images && images.length > 0) {
    const paths = images.map((img: { path: string }) => img.path);
    const { error: storageError } = await supabase.storage
      .from("news-images")
      .remove(paths);
    if (storageError) throw new Error(storageError.message);
  }

  // 3. Slet rækker fra news_images
  const { error: deleteImagesError } = await supabase
    .from("news_images")
    .delete()
    .eq("news_id", newsId);
  if (deleteImagesError) throw new Error(deleteImagesError.message);

  // 4. Slet selve nyheden
  const { error } = await supabase.from("news").delete().eq("id", newsId);
  if (error) throw new Error(error.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────────────────────────────────────

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
  company: string,
  contact: string
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
      company,
      contact,
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
  company: string,
  contact: string,
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
      company,
      contact,
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

// ─────────────────────────────────────────────────────────────────────────────
// REQUESTS
// ─────────────────────────────────────────────────────────────────────────────

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
      throw new Error(
        `Failed to fetch requests: ${error.message || "Unknown error"}`
      );
    }

    return { requests: data || [], total: count || 0 };
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

// ─────────────────────────────────────────────────────────────────────────────
// REQUEST NOTES
// ─────────────────────────────────────────────────────────────────────────────

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
// ─────────────────────────────────────────────────────────────────────────────
// JOBS
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllJobs(page: number = 1, limit: number = 6) {
  const supabase = await createServerClientInstance();
  const offset = (page - 1) * limit;

  try {
    const { data, count, error } = await supabase
      .from("jobs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(
        `Failed to fetch requests: ${error.message || "Unknown error"}`
      );
    }

    return { requests: data || [], total: count || 0 };
  } catch (err) {
    console.error("Unexpected error during fetching requests:", err);
    throw err;
  }
}

export async function getJobEnums() {
  const supabase = await createServerClientInstance();

  const fetchEnum = async (enumName: string) => {
    try {
      const { data, error } = await supabase.rpc("get_enum_values", {
        enum_name: enumName,
      });

      if (error || !data) {
        console.error(
          `[getJobEnums] Failed to fetch ${enumName}:`,
          error?.message || "No data returned"
        );
        return [];
      }

      return data;
    } catch (err) {
      console.error(
        `[getJobEnums] Unexpected error while fetching ${enumName}:`,
        err
      );
      return [];
    }
  };

  const [jobType, jobWorkplace, jobStartType] = await Promise.all([
    fetchEnum("job-type"),
    fetchEnum("job-workplace"),
    fetchEnum("job-start-type"),
  ]);

  return {
    jobType,
    jobWorkplace,
    jobStartType,
  };
}

export async function createJob(data: {
  title: string;
  subtitle: string;
  desc: string;
  type: string;
  workplace: string;
  start_type: string | null;
  start_date: string | null;
  deadline: string;
}) {
  const supabase = await createServerClientInstance();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("[createJob] Not authenticated", authError);
    throw new Error("Du er ikke logget ind");
  }

  // Generér slug ud fra title
  const baseSlug = data.title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  let slug = baseSlug;
  let counter = 1;

  // Tjek om slug findes – tilføj -1, -2, osv. hvis nødvendigt
  while (true) {
    const { data: existing } = await supabase
      .from("jobs")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!existing) break;
    slug = `${baseSlug}-${counter++}`;
  }

  const { error } = await supabase.from("jobs").insert([
    {
      title: data.title,
      subtitle: data.subtitle,
      desc: data.desc,
      type: data.type,
      workplace: data.workplace,
      start_type: data.start_type,
      start_date: data.start_date,
      deadline: data.deadline,
      slug,
    },
  ]);

  if (error) {
    console.error("[createJob] Supabase insert error:", error.message);
    throw new Error("Kunne ikke oprette job. Tjek rettigheder og data.");
  }

  console.log("[createJob] Job oprettet med slug:", slug);
}

export async function updateJob(
  jobId: string,
  data: {
    title?: string;
    subtitle?: string;
    desc?: string;
    type?: string;
    workplace?: string;
    start_type?: string | null;
    start_date?: string | null;
    deadline?: string;
    active?: boolean; // Added active property
  }
): Promise<void> {
  const supabase = await createServerClientInstance();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("[updateJob] Not authenticated", authError);
    throw new Error("Du er ikke logget ind");
  }

  const { error } = await supabase.from("jobs").update(data).eq("id", jobId);

  if (error) {
    console.error(
      "[updateJob] Supabase update error:",
      error.message,
      error.details
    );
    throw new Error("Kunne ikke opdatere job. Tjek rettigheder og data.");
  }
}

export async function deleteJob(jobId: string): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    const { error } = await supabase.from("jobs").delete().eq("id", jobId);

    if (error) {
      throw new Error(`Failed to delete job: ${error.message}`);
    }

    console.log(`[deleteJob] Job with ID ${jobId} deleted successfully.`);
  } catch (err) {
    console.error("[deleteJob] Unexpected error during job deletion:", err);
    throw err;
  }
}

export async function getJobById(jobId: string) {
  const supabase = await createServerClientInstance();

  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch job by ID: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error("Unexpected error during fetching job by ID:", err);
    throw err;
  }
}

export async function getJobBySlug(slug: string) {
  const supabase = await createServerClientInstance(); // ✅

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    console.error("Job fetch error:", error.message);
    return null;
  }

  return data;
}

export async function getApplicationsByJobId(jobId: string) {
  const supabase = await createServerClientInstance();

  try {
    const { data: applications, error } = await supabase
      .from("applications")
      .select("*")
      .eq("job_id", jobId);

    if (error) {
      throw new Error(`Failed to fetch applications: ${error.message}`);
    }

    if (!applications || applications.length === 0) return [];

    const signedApplications = await Promise.all(
      applications.map(async (app) => {
        const [cvSigned, appSigned] = await Promise.all([
          supabase.storage
            .from("applications-files")
            .createSignedUrl(app.cv, 60 * 60),
          supabase.storage
            .from("applications-files")
            .createSignedUrl(app.application, 60 * 60),
        ]);

        return {
          ...app,
          cvSignedUrl: cvSigned.data?.signedUrl || null,
          applicationSignedUrl: appSigned.data?.signedUrl || null,
        };
      })
    );

    return signedApplications;
  } catch (err) {
    console.error("Unexpected error during fetching applications:", err);
    throw err;
  }
}

export async function deleteApplication(applicationId: string): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", applicationId);

    if (error) {
      throw new Error(`Failed to delete application: ${error.message}`);
    }

    console.log(
      `[deleteApplication] Application with ID ${applicationId} deleted successfully.`
    );
  } catch (err) {
    console.error(
      "[deleteApplication] Unexpected error during application deletion:",
      err
    );
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PACKAGES AND SERVICES
// ─────────────────────────────────────────────────────────────────────────────

export async function getPackages() {
  const supabase = await createServerClientInstance();

  try {
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .order("price_eur", { ascending: true });

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
  data: {
    label?: string;
    price_eur?: number;
    price_dkk?: number;
  }
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
  } catch (err) {
    console.error("Error in updatePackage:", err);
    throw err;
  }
}
