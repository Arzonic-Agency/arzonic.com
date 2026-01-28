// src/app/api/news/social-post/route.ts
// Background job for posting to social media after news is created
import { NextResponse } from "next/server";
import { createServerClientInstance } from "@/utils/supabase/server";
import { postToFacebookPage, postToInstagram } from "@/lib/server/some";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { newsId, imageUrls, content, sharedFacebook, sharedInstagram } =
      body as {
        newsId: number;
        imageUrls: string[];
        content: string;
        sharedFacebook: boolean;
        sharedInstagram: boolean;
      };

    if (!newsId) {
      return NextResponse.json(
        { error: "newsId is required" },
        { status: 400 },
      );
    }

    const supabase = await createServerClientInstance();

    // Update status to processing
    await supabase
      .from("news")
      .update({ social_status: "processing" })
      .eq("id", newsId);

    const results: {
      facebook?: { success: boolean; link?: string; error?: string };
      instagram?: { success: boolean; link?: string; error?: string };
    } = {};

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

    // Process Facebook result
    if (sharedFacebook) {
      if (fbResult.status === "fulfilled" && fbResult.value?.link) {
        results.facebook = { success: true, link: fbResult.value.link };
        await supabase
          .from("news")
          .update({
            linkFacebook: fbResult.value.link,
            sharedFacebook: true,
          })
          .eq("id", newsId);
      } else if (fbResult.status === "rejected") {
        results.facebook = {
          success: false,
          error: fbResult.reason?.message || "Facebook posting failed",
        };
        console.error("Facebook posting failed:", fbResult.reason);
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
        results.instagram = { success: true, link: instagramLink };
        await supabase
          .from("news")
          .update({
            linkInstagram: instagramLink,
            sharedInstagram: true,
          })
          .eq("id", newsId);
      } else if (igResult.status === "rejected") {
        results.instagram = {
          success: false,
          error: igResult.reason?.message || "Instagram posting failed",
        };
        console.error("Instagram posting failed:", igResult.reason);
      }
    }

    // Determine final status
    const hasErrors =
      (sharedFacebook && results.facebook?.success === false) ||
      (sharedInstagram &&
        imageUrls.length > 0 &&
        results.instagram?.success === false);

    const finalStatus = hasErrors ? "partial" : "completed";

    // Update final status
    await supabase
      .from("news")
      .update({ social_status: finalStatus })
      .eq("id", newsId);

    return NextResponse.json({
      success: true,
      newsId,
      status: finalStatus,
      results,
    });
  } catch (error) {
    console.error("Social post API error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
