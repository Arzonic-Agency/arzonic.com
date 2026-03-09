"use server";

import {
  createAdminClient,
  createServerClientInstance,
} from "@/utils/supabase/server";
import { after } from "next/server";
import sharp from "sharp";
import {
  postToFacebookPage,
  deleteFacebookPost,
  postToInstagram,
} from "./some";

// ─────────────────────────────────────────────────────────────────────────────
// DEEPL TRANSLATION HELPER (header-baseret auth - november 2025 krav)
// ─────────────────────────────────────────────────────────────────────────────

const DEEPL_ENDPOINT = "https://api-free.deepl.com/v2/translate";

async function translateWithDeepL(
  text: string,
  targetLang: string,
): Promise<{ text: string; detected_source_language: string }> {
  const apiKey = process.env.DEEPL_API_KEY!;
  const response = await fetch(DEEPL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: [text],
      target_lang: targetLang,
    }),
  });
  if (!response.ok) {
    throw new Error(`DeepL error ${response.status}: ${await response.text()}`);
  }
  const result = (await response.json()) as {
    translations: { text: string; detected_source_language: string }[];
  };
  return result.translations[0];
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
    // Oversæt beskrivelse
    const first = await translateWithDeepL(desc, "EN");
    const sourceLang = first.detected_source_language.toLowerCase();

    let desc_translated = first.text;
    if (sourceLang === "en") {
      const second = await translateWithDeepL(desc, "DA");
      desc_translated = second.text;
    }

    // Oversæt land
    const countryResult = await translateWithDeepL(country, "EN");
    const country_translated = countryResult.text;

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
  website?: string,
): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    // Oversæt beskrivelse
    const first = await translateWithDeepL(desc, "EN");
    const sourceLang = first.detected_source_language.toLowerCase();

    let desc_translated = first.text;
    if (sourceLang === "en") {
      const second = await translateWithDeepL(desc, "DA");
      desc_translated = second.text;
    }

    // Oversæt land
    const countryResult = await translateWithDeepL(country, "EN");
    const country_translated = countryResult.text;

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

export async function getCasesCount() {
  const supabase = await createServerClientInstance();
  const { count, error } = await supabase
    .from("cases")
    .select("*", { count: "exact", head: true });

  if (error) throw new Error(error.message);
  return count ?? 0;
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
  content,
  images,
  sharedFacebook = false,
  sharedInstagram = false,
}: {
  content: string;
  images?: File[];
  sharedFacebook?: boolean;
  sharedInstagram?: boolean;
}): Promise<{
  newsId: number;
  status: "created" | "processing_social";
  linkFacebook?: string;
  linkInstagram?: string;
}> {
  try {
    // Input validation
    if (!content || content.trim().length === 0) {
      throw new Error("Content is required");
    }

    // Validate Instagram requirement early
    if (sharedInstagram && (!images || images.length === 0)) {
      throw new Error(
        "Instagram kræver mindst ét billede for at dele et opslag",
      );
    }

    const supabase = await createServerClientInstance();

    if (!process.env.DEEPL_API_KEY) {
      throw new Error("Translation service not configured");
    }

    // Run auth check and translation in parallel for speed
    const [authResult, translationResult] = await Promise.all([
      supabase.auth.getUser(),
      translateWithDeepL(content, "EN").catch((err) => {
        console.error("Content translation error:", err);
        return null;
      }),
    ]);

    const { data: ud, error: ue } = authResult;
    if (ue || !ud?.user) {
      throw new Error("Not authenticated");
    }

    // Process translation result
    let content_translated = content;
    let sourceLang = "da";

    if (translationResult) {
      sourceLang =
        translationResult.detected_source_language?.toLowerCase() || "da";
      content_translated = translationResult.text;

      // If source is English, translate to Danish
      if (sourceLang === "en") {
        try {
          const second = await translateWithDeepL(content, "DA");
          content_translated = second.text;
        } catch {
          content_translated = content;
        }
      }
    }

    // Determine initial social status
    const needsSocialPosting = sharedFacebook || sharedInstagram;
    const initialSocialStatus = needsSocialPosting ? "pending" : null;

    // Insert news into database
    const { data: newsData, error: insertError } = await supabase
      .from("news")
      .insert([
        {
          content,
          content_translated,
          source_lang: sourceLang,
          creator_id: ud.user.id,
          social_status: initialSocialStatus,
        },
      ])
      .select("id")
      .single();

    if (insertError || !newsData?.id) {
      console.error("Database insert error:", insertError);
      throw new Error("Failed to create news in database");
    }

    // Upload images and collect URLs - only after news is created
    const imageUrls: string[] = [];
    if (images?.length) {
      try {
        // Process all images in parallel
        const uploadResults = await Promise.all(
          images.map(async (file, index) => {
            const ext = "webp";
            const name = `${Math.random().toString(36).slice(2)}.${ext}`;
            const path = `${ud.user.id}/${name}`;

            try {
              const buf = await sharp(Buffer.from(await file.arrayBuffer()))
                .rotate()
                .resize({ width: 1080, height: 1350, fit: "cover" })
                .webp({ quality: 80 })
                .toBuffer();

              const { error: uploadError } = await supabase.storage
                .from("news-images")
                .upload(path, buf, {
                  contentType: "image/webp",
                });

              if (uploadError) {
                console.error("Image upload error:", uploadError);
                return null;
              }

              const publicUrlData = supabase.storage
                .from("news-images")
                .getPublicUrl(path);

              if (!publicUrlData.data?.publicUrl) {
                console.error("Public URL generation failed for path:", path);
                return null;
              }

              return {
                url: publicUrlData.data.publicUrl,
                path,
                index,
              };
            } catch (imageProcessingError) {
              console.error("Image processing error:", imageProcessingError);
              return null;
            }
          }),
        );

        // Filter successful uploads and insert metadata
        const successfulUploads = uploadResults.filter(
          (r): r is { url: string; path: string; index: number } => r !== null,
        );

        // Insert all image metadata in parallel
        if (successfulUploads.length > 0) {
          await Promise.all(
            successfulUploads.map((upload) =>
              supabase.from("news_images").insert({
                news_id: newsData.id,
                path: upload.path,
                sort_order: upload.index,
              }),
            ),
          );

          // Collect URLs in order
          successfulUploads
            .sort((a, b) => a.index - b.index)
            .forEach((upload) => imageUrls.push(upload.url));
        }
      } catch (imageError) {
        console.error("General image upload error:", imageError);
      }
    }

    // If social posting is requested, run it in background using Next.js after()
    if (needsSocialPosting) {
      const newsId = newsData.id;

      // Use Next.js after() to run social posting after response is sent
      after(async () => {
        // Create a new supabase client for the background task
        const bgSupabase = await createServerClientInstance();

        try {
          console.log(
            "🚀 Starting background social posting for news:",
            newsId,
          );

          // Update status to processing
          await bgSupabase
            .from("news")
            .update({ social_status: "processing" })
            .eq("id", newsId);

          // Post to Facebook and Instagram in parallel
          const [fbResult, igResult] = await Promise.allSettled([
            sharedFacebook
              ? postToFacebookPage({
                  message: content,
                  imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
                })
              : Promise.resolve(null),
            sharedInstagram && imageUrls.length > 0
              ? postToInstagram({
                  caption: content,
                  imageUrls,
                })
              : Promise.resolve(null),
          ]);

          let hasErrors = false;

          // Process Facebook result
          if (sharedFacebook) {
            if (fbResult.status === "fulfilled" && fbResult.value?.link) {
              await bgSupabase
                .from("news")
                .update({
                  linkFacebook: fbResult.value.link,
                  sharedFacebook: true,
                })
                .eq("id", newsId);
              console.log("✅ Facebook post successful:", fbResult.value.link);
            } else if (fbResult.status === "rejected") {
              hasErrors = true;
              console.error("❌ Facebook posting failed:", fbResult.reason);
            }
          }

          // Process Instagram result
          if (sharedInstagram && imageUrls.length > 0) {
            if (
              igResult.status === "fulfilled" &&
              igResult.value?.success &&
              igResult.value?.id
            ) {
              const instagramLink =
                igResult.value.permalink ||
                `Instagram Media ID: ${igResult.value.id}`;
              await bgSupabase
                .from("news")
                .update({
                  linkInstagram: instagramLink,
                  sharedInstagram: true,
                })
                .eq("id", newsId);
              console.log("✅ Instagram post successful:", instagramLink);
            } else if (igResult.status === "rejected") {
              hasErrors = true;
              console.error("❌ Instagram posting failed:", igResult.reason);
            }
          }

          // Update final status
          const finalStatus = hasErrors ? "partial" : "completed";
          await bgSupabase
            .from("news")
            .update({ social_status: finalStatus })
            .eq("id", newsId);

          console.log(
            `✅ Social posting completed with status: ${finalStatus}`,
          );
        } catch (err) {
          console.error("Background social posting error:", err);
          await bgSupabase
            .from("news")
            .update({ social_status: "error" })
            .eq("id", newsId);
        }
      });

      return {
        newsId: newsData.id,
        status: "processing_social",
      };
    }

    return {
      newsId: newsData.id,
      status: "created",
    };
  } catch (error) {
    console.error("createNews error:", error);

    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unexpected error occurred while creating news");
    }
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

export async function getNewsCount() {
  const supabase = await createServerClientInstance();
  const { count, error } = await supabase
    .from("news")
    .select("*", { count: "exact", head: true });

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function getNewsById(newsId: number) {
  const supabase = await createServerClientInstance();
  const { data, error } = await supabase
    .from("news")
    .select("*, news_images(*)")
    .eq("id", newsId)
    .single();
  if (error) throw new Error(error.message);

  // Transform data to include image URLs and paths
  const images =
    (data.news_images as NewsImage[] | undefined)
      ?.sort((a, b) => a.sort_order - b.sort_order)
      ?.map((img) => {
        const { data: publicUrlData } = supabase.storage
          .from("news-images")
          .getPublicUrl(img.path);
        return {
          url: publicUrlData.publicUrl,
          path: img.path,
        };
      }) || [];

  return {
    ...data,
    images,
  };
}

export async function deleteNews(newsId: number): Promise<void> {
  const supabase = await createServerClientInstance();

  // Get news data before deletion to check for Facebook and Instagram posts
  const { data: newsData } = await supabase
    .from("news")
    .select("linkFacebook, linkInstagram")
    .eq("id", newsId)
    .single();

  // Delete Facebook post if it exists
  if (newsData?.linkFacebook) {
    try {
      console.log(
        "🔍 [deleteNews] Found Facebook link:",
        newsData.linkFacebook,
      );
      const postId = newsData.linkFacebook.split("/").pop();
      if (postId) {
        console.log(
          "🗑️ [deleteNews] Attempting to delete Facebook post:",
          postId,
        );
        await deleteFacebookPost(postId);
      } else {
        console.log("⚠️ [deleteNews] Could not extract Facebook post ID");
      }
    } catch (error) {
      console.error("Failed to delete Facebook post:", error);
      // Continue with news deletion even if Facebook deletion fails
    }
  }

  // Delete Instagram post if it exists
  if (newsData?.linkInstagram) {
    console.log(
      "⚠️ [deleteNews] Instagram post found but cannot be deleted automatically via API",
    );
    console.log("🔍 [deleteNews] Instagram link:", newsData.linkInstagram);
    console.log(
      "ℹ️ [deleteNews] Please manually delete the Instagram post if needed",
    );
    // Note: Instagram API does not support programmatic deletion of posts
    // The post will need to be manually deleted on Instagram
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

async function detectAndTranslate(text: string) {
  const first = await translateWithDeepL(text, "EN");
  const sourceLang = first.detected_source_language.toLowerCase(); // "en" or "da"
  let translated = first.text;

  if (sourceLang === "en") {
    const second = await translateWithDeepL(text, "DA");
    translated = second.text;
  }

  return { sourceLang, translated };
}

export async function createReview(
  desc: string,
  rate: number,
  company: string,
  contact: string,
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

export async function getReviewsCount() {
  const supabase = await createServerClientInstance();
  const { count, error } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true });

  if (error) throw new Error(error.message);
  return count ?? 0;
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
  rate: number,
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
        `Failed to fetch requests: ${error.message || "Unknown error"}`,
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
    company?: string;
    category?: string;
    mobile?: string;
    mail?: string;
    message?: string;
    address?: string;
    city?: string;
  },
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
  requestId: string,
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
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sender push notifications til brugere baseret på deres subscriptions
 */
export async function sendPushNotificationsToUsers(
  userIds: string[],
  notification: {
    title: string;
    body: string;
    tag?: string;
    url?: string;
    requestId?: string | number;
  },
): Promise<{ success: boolean; sent: number; errors: number }> {
  let webpush: typeof import("web-push") | null = null;
  try {
    webpush = await import("web-push");
  } catch {
    return { success: false, sent: 0, errors: 0 };
  }

  const supabase = await createAdminClient();
  let sent = 0;
  let errors = 0;

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const vapidEmail = process.env.VAPID_EMAIL || "noreply@arzonic.com";

  if (!publicKey || !privateKey) {
    return { success: false, sent: 0, errors: 0 };
  }

  webpush.setVapidDetails(`mailto:${vapidEmail}`, publicKey, privateKey);

  const { data: subscriptions, error: subError } = await supabase
    .from("push_subscriptions")
    .select("*")
    .in("user_id", userIds);

  if (subError || !subscriptions || subscriptions.length === 0) {
    return { success: true, sent: 0, errors: 0 };
  }

  const { data: members } = await supabase
    .from("members")
    .select("id, push_notifications_enabled")
    .in("id", userIds);

  const preferencesMap = new Map(
    (members || []).map((m) => [m.id, m.push_notifications_enabled ?? true]),
  );

  for (const sub of subscriptions) {
    const userEnabled = preferencesMap.get(sub.user_id) ?? true;
    if (!userEnabled) {
      continue;
    }

    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        JSON.stringify({
          title: notification.title,
          body: notification.body,
          tag: notification.tag || "default",
          url: notification.url || "/admin/messages",
          requestId: notification.requestId || null,
        }),
      );
      sent++;
    } catch (error: unknown) {
      errors++;

      if (
        error &&
        typeof error === "object" &&
        "statusCode" in error &&
        ((error as { statusCode: number }).statusCode === 410 ||
          (error as { statusCode: number }).statusCode === 404)
      ) {
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("endpoint", sub.endpoint);
      }
    }
  }

  return { success: true, sent, errors };
}

export async function createNotificationForAdmins(
  requestId: number | string,
  company: string,
  allowedRoles: Array<"admin" | "developer"> = ["admin", "developer"],
  notificationType: "request" | "estimator" = "request",
) {
  const supabase = await createAdminClient();

  const { data: admins, error: adminsError } = await supabase
    .from("members")
    .select("id")
    .in("role", allowedRoles);

  if (adminsError || !admins || admins.length === 0) {
    return { error: "Kunne ikke oprette notifikationer" };
  }

  const now = new Date().toISOString();
  const notifications = admins.map((admin) => ({
    user_id: admin.id,
    request_id: typeof requestId === "string" ? requestId : requestId,
    message: company,
    notification_type: notificationType,
    is_read: false,
    created_at: now,
  }));

  const { error: notifError } = await supabase
    .from("notifications")
    .insert(notifications);

  if (notifError) {
    return { error: "Kunne ikke oprette notifikationer" };
  }

  // Send push notifications til admins
  const pushTitle =
    notificationType === "estimator"
      ? "Ny prisberegning foretaget"
      : "Ny henvendelse";
  const pushBody =
    notificationType === "estimator"
      ? `${company} har foretaget en ny prisberegning`
      : `${company} har sendt en ny henvendelse`;

  try {
    const adminIds = admins.map((admin) => admin.id);
    await sendPushNotificationsToUsers(adminIds, {
      title: pushTitle,
      body: pushBody,
      tag: `${notificationType}-${requestId}`,
      url: `/admin/messages?requestId=${requestId}`,
      requestId: requestId,
    });
  } catch {
    // Ignore push errors - notifications are still created in database
  }

  return { success: true };
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
        `Failed to fetch requests: ${error.message || "Unknown error"}`,
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
          error?.message || "No data returned",
        );
        return [];
      }

      return data;
    } catch (err) {
      console.error(
        `[getJobEnums] Unexpected error while fetching ${enumName}:`,
        err,
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
  },
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
      error.details,
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
      }),
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
      `[deleteApplication] Application with ID ${applicationId} deleted successfully.`,
    );
  } catch (err) {
    console.error(
      "[deleteApplication] Unexpected error during application deletion:",
      err,
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
      .order("yearly_eur", { ascending: true });

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
      .from("features")
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
    yearly_eur?: number;
    yearly_dkk?: number;
  },
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

// ─────────────────────────────────────────────────────────────────────────────
// Documentation (Topics & Sections)
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// TOPICS
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllTopics() {
  const supabase = await createServerClientInstance();

  try {
    const { data, error } = await supabase
      .from("doc_topics")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch topics: ${error.message}`);
    }

    return { topics: data || [] };
  } catch (err) {
    console.error("Unexpected error during fetching topics:", err);
    throw err;
  }
}

export async function createDocsTopic(title: string): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    // Validation
    if (!title || title.trim().length === 0) {
      throw new Error("Title is required");
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle.length > 200) {
      throw new Error("Title must be 200 characters or less");
    }

    // Generate slug from title (same pattern as Jobs)
    const baseSlug = trimmedTitle
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!baseSlug) {
      throw new Error("Title must contain at least one alphanumeric character");
    }

    let slug = baseSlug;
    let counter = 1;

    // Check for duplicate slugs and append -1, -2, etc. if necessary
    while (true) {
      const { data: existing } = await supabase
        .from("doc_topics")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (!existing) break;
      slug = `${baseSlug}-${counter++}`;
    }

    // Find max order_index and add 10
    const { data: maxOrderData } = await supabase
      .from("doc_topics")
      .select("order_index")
      .order("order_index", { ascending: false })
      .limit(1)
      .maybeSingle();

    const order_index = (maxOrderData?.order_index || 0) + 10;

    // Insert new topic
    const { error } = await supabase.from("doc_topics").insert([
      {
        title: trimmedTitle,
        slug,
        order_index,
        is_hidden: false,
      },
    ]);

    if (error) {
      console.error("[createDocsTopic] Supabase insert error:", error.message);
      throw new Error(`Failed to create topic: ${error.message}`);
    }

    console.log("[createDocsTopic] Topic created with slug:", slug);
  } catch (err) {
    console.error(
      "[createDocsTopic] Unexpected error during topic creation:",
      err,
    );
    throw err;
  }
}

export async function updateDocsTopic(
  topicId: string,
  title: string,
  isHidden?: boolean,
): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    if (!topicId || topicId.trim().length === 0) {
      throw new Error("Topic ID is required");
    }

    if (!title || title.trim().length === 0) {
      throw new Error("Title is required");
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle.length > 200) {
      throw new Error("Title must be 200 characters or less");
    }

    const { data: existingTopic } = await supabase
      .from("doc_topics")
      .select("id")
      .eq("id", topicId)
      .maybeSingle();

    if (!existingTopic) {
      throw new Error("Topic not found");
    }

    const baseSlug = trimmedTitle
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!baseSlug) {
      throw new Error("Title must contain at least one alphanumeric character");
    }

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const { data: duplicate } = await supabase
        .from("doc_topics")
        .select("id")
        .eq("slug", slug)
        .neq("id", topicId)
        .maybeSingle();

      if (!duplicate) break;
      slug = `${baseSlug}-${counter++}`;
    }

    const { error } = await supabase
      .from("doc_topics")
      .update({
        title: trimmedTitle,
        slug,
        ...(isHidden !== undefined && { is_hidden: isHidden }),
      })
      .eq("id", topicId);

    if (error) {
      throw new Error(`Failed to update topic: ${error.message}`);
    }
  } catch (err) {
    console.error("[updateDocsTopic] Unexpected error during update:", err);
    throw err;
  }
}

export async function deleteDocsTopic(topicId: string): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    if (!topicId || topicId.trim().length === 0) {
      throw new Error("Topic ID is required");
    }

    const { error: deleteSectionsError } = await supabase
      .from("doc_sections")
      .delete()
      .eq("topic_id", topicId);

    if (deleteSectionsError) {
      throw new Error(
        `Failed to delete sections for topic: ${deleteSectionsError.message}`,
      );
    }

    const { error: deleteTopicError } = await supabase
      .from("doc_topics")
      .delete()
      .eq("id", topicId);

    if (deleteTopicError) {
      throw new Error(`Failed to delete topic: ${deleteTopicError.message}`);
    }
  } catch (err) {
    console.error("[deleteDocsTopic] Unexpected error during delete:", err);
    throw err;
  }
}

export async function updateDocsTopicsOrder(topicIds: string[]): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    if (!Array.isArray(topicIds) || topicIds.length === 0) {
      throw new Error("Topic IDs are required");
    }

    const updatePromises = topicIds.map((topicId, index) =>
      supabase
        .from("doc_topics")
        .update({ order_index: (index + 1) * 10 })
        .eq("id", topicId),
    );

    const results = await Promise.all(updatePromises);
    const failed = results.find((result) => result.error);

    if (failed?.error) {
      throw new Error(`Failed to update topic order: ${failed.error.message}`);
    }
  } catch (err) {
    console.error("[updateDocsTopicsOrder] Unexpected error:", err);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTIONS
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllSectionsByTopicId(topicId: string) {
  const supabase = await createServerClientInstance();

  try {
    const { data, error } = await supabase
      .from("doc_sections")
      .select("*")
      .eq("topic_id", topicId)
      .order("order_index", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch sections: ${error.message}`);
    }

    return { sections: data || [] };
  } catch (err) {
    console.error("Unexpected error during fetching sections:", err);
    throw err;
  }
}

export async function createDocsSection(
  topicId: string,
  title: string,
  description: string,
): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    // Validation
    if (!topicId || topicId.trim().length === 0) {
      throw new Error("Topic ID is required");
    }

    if (!title || title.trim().length === 0) {
      throw new Error("Title is required");
    }

    if (!description || description.trim().length === 0) {
      throw new Error("Description is required");
    }

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (trimmedTitle.length > 200) {
      throw new Error("Title must be 200 characters or less");
    }

    if (trimmedDescription.length > 500) {
      throw new Error("Description must be 500 characters or less");
    }

    // Verify topic exists
    const { data: topicExists } = await supabase
      .from("doc_topics")
      .select("id")
      .eq("id", topicId)
      .maybeSingle();

    if (!topicExists) {
      throw new Error("Topic not found");
    }

    // Generate slug from title
    const baseSlug = trimmedTitle
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!baseSlug) {
      throw new Error("Title must contain at least one alphanumeric character");
    }

    let slug = baseSlug;
    let counter = 1;

    // Check for duplicate slugs within the same topic
    while (true) {
      const { data: existing } = await supabase
        .from("doc_sections")
        .select("id")
        .eq("topic_id", topicId)
        .eq("slug", slug)
        .maybeSingle();

      if (!existing) break;
      slug = `${baseSlug}-${counter++}`;
    }

    // Find max order_index for this topic and add 10
    const { data: maxOrderData } = await supabase
      .from("doc_sections")
      .select("order_index")
      .eq("topic_id", topicId)
      .order("order_index", { ascending: false })
      .limit(1)
      .maybeSingle();

    const order_index = (maxOrderData?.order_index || 0) + 10;

    // Insert new section
    const { error } = await supabase.from("doc_sections").insert([
      {
        topic_id: topicId,
        title: trimmedTitle,
        slug,
        description: trimmedDescription,
        order_index,
        is_hidden: false,
      },
    ]);

    if (error) {
      console.error(
        "[createDocsSection] Supabase insert error:",
        error.message,
      );
      throw new Error(`Failed to create section: ${error.message}`);
    }

    console.log("[createDocsSection] Section created with slug:", slug);
  } catch (err) {
    console.error(
      "[createDocsSection] Unexpected error during section creation:",
      err,
    );
    throw err;
  }
}

export async function updateDocsSection(
  sectionId: string,
  title: string,
  description: string,
  isHidden?: boolean,
): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    if (!sectionId || sectionId.trim().length === 0) {
      throw new Error("Section ID is required");
    }

    if (!title || title.trim().length === 0) {
      throw new Error("Title is required");
    }

    if (!description || description.trim().length === 0) {
      throw new Error("Description is required");
    }

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (trimmedTitle.length > 200) {
      throw new Error("Title must be 200 characters or less");
    }

    if (trimmedDescription.length > 500) {
      throw new Error("Description must be 500 characters or less");
    }

    const { data: existingSection } = await supabase
      .from("doc_sections")
      .select("id, topic_id")
      .eq("id", sectionId)
      .maybeSingle();

    if (!existingSection) {
      throw new Error("Section not found");
    }

    const baseSlug = trimmedTitle
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!baseSlug) {
      throw new Error("Title must contain at least one alphanumeric character");
    }

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const { data: duplicate } = await supabase
        .from("doc_sections")
        .select("id")
        .eq("topic_id", existingSection.topic_id)
        .eq("slug", slug)
        .neq("id", sectionId)
        .maybeSingle();

      if (!duplicate) break;
      slug = `${baseSlug}-${counter++}`;
    }

    const { error } = await supabase
      .from("doc_sections")
      .update({
        title: trimmedTitle,
        description: trimmedDescription,
        slug,
        ...(isHidden !== undefined && { is_hidden: isHidden }),
      })
      .eq("id", sectionId);

    if (error) {
      throw new Error(`Failed to update section: ${error.message}`);
    }
  } catch (err) {
    console.error("[updateDocsSection] Unexpected error during update:", err);
    throw err;
  }
}

export async function deleteDocsSection(sectionId: string): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    if (!sectionId || sectionId.trim().length === 0) {
      throw new Error("Section ID is required");
    }

    const { error } = await supabase
      .from("doc_sections")
      .delete()
      .eq("id", sectionId);

    if (error) {
      throw new Error(`Failed to delete section: ${error.message}`);
    }
  } catch (err) {
    console.error("[deleteDocsSection] Unexpected error during delete:", err);
    throw err;
  }
}

export async function updateDocsSectionsOrder(
  topicId: string,
  sectionIds: string[],
): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    if (!topicId || topicId.trim().length === 0) {
      throw new Error("Topic ID is required");
    }

    if (!Array.isArray(sectionIds) || sectionIds.length === 0) {
      throw new Error("Section IDs are required");
    }

    const updatePromises = sectionIds.map((sectionId, index) =>
      supabase
        .from("doc_sections")
        .update({ order_index: (index + 1) * 10 })
        .eq("id", sectionId)
        .eq("topic_id", topicId),
    );

    const results = await Promise.all(updatePromises);
    const failed = results.find((result) => result.error);

    if (failed?.error) {
      throw new Error(
        `Failed to update section order: ${failed.error.message}`,
      );
    }
  } catch (err) {
    console.error("[updateDocsSectionsOrder] Unexpected error:", err);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUSH NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Gemmer push subscription i Supabase
 * @param subscription - PushSubscription objekt fra browseren
 * @param userId - Optional user ID hvis brugeren er logget ind
 * @param userAgent - Optional user agent string (browser/device info)
 */
export async function savePushSubscription(
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  },
  userId?: string,
  userAgent?: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClientInstance();

  try {
    // Konverter subscription til JSON format
    const subscriptionData = {
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      user_id: userId || null,
      user_agent: userAgent || null,
      created_at: new Date().toISOString(),
    };

    // Tjek om subscription allerede findes (baseret på endpoint)
    const { data: existing } = await supabase
      .from("push_subscriptions")
      .select("id")
      .eq("endpoint", subscription.endpoint)
      .maybeSingle();

    if (existing) {
      // Opdater eksisterende subscription
      const { error } = await supabase
        .from("push_subscriptions")
        .update({
          p256dh: subscriptionData.p256dh,
          auth: subscriptionData.auth,
          user_id: subscriptionData.user_id,
          user_agent: subscriptionData.user_agent,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (error) {
        return { success: false, error: error.message };
      }
    } else {
      // Opret ny subscription
      const { error } = await supabase
        .from("push_subscriptions")
        .insert([subscriptionData]);

      if (error) {
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Sletter push subscription fra Supabase
 */
export async function deletePushSubscription(
  endpoint: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClientInstance();

  try {
    const { error } = await supabase
      .from("push_subscriptions")
      .delete()
      .eq("endpoint", endpoint);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Opdaterer push notification preference for en bruger
 */
export async function updateUserPushNotificationPreference(
  userId: string,
  enabled: boolean,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClientInstance();

  try {
    const { error } = await supabase
      .from("members")
      .update({ push_notifications_enabled: enabled })
      .eq("id", userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
