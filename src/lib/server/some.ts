export async function getPageAccessToken(): Promise<string> {
  const sysToken = process.env.FB_SYSTEM_USER_TOKEN!;
  const pageId = process.env.FB_SYSTEM_PAGE_ID!;

  const res = await fetch(
    `https://graph.facebook.com/v20.0/me/accounts?access_token=${sysToken}`
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Kunne ikke hente page token: ${err}`);
  }

  const data = await res.json();
  const page = data.data?.find(
    (p: { id: string; access_token?: string }) => p.id === pageId
  );

  if (!page?.access_token) {
    throw new Error("Page access token ikke fundet");
  }

  return page.access_token;
}

export async function postToFacebookPage({
  message,
  imageUrls,
}: {
  message: string;
  imageUrls?: string[];
}): Promise<{ link?: string } | null> {
  console.log("🚀 [SERVER] Starting Facebook post via system user...");
  console.log("📝 Message:", message);

  const pageId = process.env.FB_SYSTEM_PAGE_ID!;
  const systemToken = process.env.FB_SYSTEM_USER_TOKEN!;

  if (!systemToken || !pageId) {
    throw new Error("Facebook systembruger token eller page ID mangler");
  }

  const selectedPageId = pageId;

  // Get proper page access token
  const pageAccessToken = await getPageAccessToken();
  console.log("🔑 [SERVER] Retrieved page access token");

  try {
    // Hvis der kun er ét billede - brug /photos endpoint direkte
    if (imageUrls && imageUrls.length === 1) {
      const res = await fetch(
        `https://graph.facebook.com/v20.0/${selectedPageId}/photos`,
        {
          method: "POST",
          body: new URLSearchParams({
            url: imageUrls[0],
            message,
            published: "true", // Publiser direkte
            access_token: pageAccessToken,
          }),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        console.error("Photo post error:", data);
        throw new Error(`Fejl ved billede-opslag: ${data.error?.message}`);
      }

      console.log(
        "✅ [SERVER] Facebook photo post created successfully:",
        data.id
      );
      return {
        link: data.id ? `https://www.facebook.com/${data.id}` : undefined,
      };
    }

    // For posts uden billeder eller med flere billeder - brug /feed endpoint
    const postBody: Record<string, string> = {
      message,
      access_token: pageAccessToken,
    };

    // Hvis flere billeder - upload dem først som published photos, så del dem
    if (imageUrls && imageUrls.length > 1) {
      const photoIds: string[] = [];

      for (const url of imageUrls) {
        const res = await fetch(
          `https://graph.facebook.com/v20.0/${selectedPageId}/photos`,
          {
            method: "POST",
            body: new URLSearchParams({
              url,
              published: "true", // Publiser direkte
              no_story: "true", // Undgå at lave separate posts
              access_token: pageAccessToken,
            }),
          }
        );
        const data = await res.json();
        if (!res.ok) {
          console.error("Photo upload error:", data);
          throw new Error(`Kunne ikke uploade billede: ${data.error?.message}`);
        }
        photoIds.push(data.id);
      }

      // Opret samlende post der refererer til billederne
      postBody.child_attachments = JSON.stringify(
        photoIds.map((id) => ({ media_fbid: id }))
      );
    }

    // Opret post (kun hvis ikke single photo)
    if (!imageUrls || imageUrls.length !== 1) {
      const postRes = await fetch(
        `https://graph.facebook.com/v20.0/${selectedPageId}/feed`,
        {
          method: "POST",
          body: new URLSearchParams(postBody),
        }
      );
      const postData = await postRes.json();

      if (!postRes.ok) {
        console.error("Facebook post error:", postData);
        throw new Error(`Fejl ved opslag: ${postData.error?.message}`);
      }

      console.log(
        "✅ [SERVER] Facebook post created successfully:",
        postData.id
      );
      return {
        link: postData.id
          ? `https://www.facebook.com/${postData.id}`
          : undefined,
      };
    }

    // If we got here, it was a single photo post that was already handled
    return null;
  } catch (error) {
    console.error("❌ [SERVER] Facebook posting failed:", error);
    throw error;
  }
}

export async function deleteFacebookPost(
  postId: string
): Promise<{ success: boolean }> {
  console.log("🗑️ [SERVER] Deleting Facebook post:", postId);

  const pageId = process.env.FB_SYSTEM_PAGE_ID!;
  const systemToken = process.env.FB_SYSTEM_USER_TOKEN!;

  if (!systemToken || !pageId) {
    throw new Error("Facebook system-token eller page ID mangler");
  }

  // Get proper page access token
  const pageAccessToken = await getPageAccessToken();

  const res = await fetch(`https://graph.facebook.com/v20.0/${postId}`, {
    method: "DELETE",
    body: new URLSearchParams({
      access_token: pageAccessToken,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error("❌ [SERVER] Facebook deletion failed:", errorData);
    throw new Error(`Fejl ved sletning: ${errorData.error?.message}`);
  }

  console.log("✅ [SERVER] Facebook post deleted successfully!");
  return { success: true };
}

export async function updateFacebookPost({
  postId,
  message,
  imageUrls = [],
}: {
  postId: string;
  message: string;
  imageUrls?: string[];
}): Promise<{ link?: string } | null> {
  try {
    console.log("🔄 [SERVER] Updating Facebook post...");
    const accessToken = await getPageAccessToken();

    // Try to edit message first
    try {
      console.log("✏️ [SERVER] Attempting to edit message only...");

      const body = new URLSearchParams({ message, access_token: accessToken });
      const editRes = await fetch(
        `https://graph.facebook.com/v21.0/${postId}`,
        {
          method: "POST",
          body,
        }
      );

      if (!editRes.ok) {
        const t = await editRes.text();
        throw new Error(`Failed to edit message: ${editRes.status} ${t}`);
      }

      // Get permalink to the updated post
      const permalinkRes = await fetch(
        `https://graph.facebook.com/v21.0/${postId}?fields=permalink_url&access_token=${accessToken}`
      );

      if (!permalinkRes.ok) {
        const t = await permalinkRes.text();
        throw new Error(
          `Failed to fetch permalink: ${permalinkRes.status} ${t}`
        );
      }

      const permalinkData = (await permalinkRes.json()) as {
        permalink_url?: string;
      };
      console.log("✅ [SERVER] Facebook post message updated successfully!");
      return { link: permalinkData.permalink_url };
    } catch (error) {
      console.log("⚠️ [SERVER] Message edit failed, recreating post:", error);
      // Fallback: delete and recreate post
      await deleteFacebookPost(postId);
      return await postToFacebookPage({ message, imageUrls });
    }
  } catch (error) {
    console.error("❌ [SERVER] Error updating Facebook post:", error);
    throw error;
  }
}

export async function postToInstagram({
  caption,
  imageUrl,
}: {
  caption: string;
  imageUrl?: string;
}): Promise<{ success: boolean; id?: string; permalink?: string }> {
  console.log("🚀 [SERVER] Starting Instagram post...");
  console.log("📝 Caption:", caption);

  const instagramBusinessId = process.env.INSTAGRAM_BUSINESS_ID!;
  if (!instagramBusinessId) throw new Error("INSTAGRAM_BUSINESS_ID mangler");

  const accessToken = process.env.FB_SYSTEM_USER_TOKEN!;
  if (!accessToken) {
    throw new Error("FB_SYSTEM_USER_TOKEN mangler");
  }

  if (!imageUrl) throw new Error("Instagram kræver mindst ét billede");
  if (!/^https:\/\//i.test(imageUrl)) {
    throw new Error("imageUrl skal være en offentligt tilgængelig HTTPS-URL");
  }

  try {
    // 1) Opret media-container
    const mediaRes = await fetch(
      `https://graph.facebook.com/v20.0/${instagramBusinessId}/media`,
      {
        method: "POST",
        body: new URLSearchParams({
          image_url: imageUrl,
          caption,
          access_token: accessToken,
        }),
      }
    );

    const mediaData = await mediaRes.json();
    if (!mediaRes.ok) {
      console.error("Instagram media upload error:", mediaData);
      const msg = mediaData?.error?.message || "Ukendt fejl ved upload";
      throw new Error(`Kunne ikke uploade billede: ${msg}`);
    }

    const creationId = mediaData.id as string | undefined;
    if (!creationId) {
      throw new Error("Creation ID mangler efter media-upload");
    }

    console.log("✅ [SERVER] Instagram media uploaded:", creationId);

    // 2) Publicér
    const publishRes = await fetch(
      `https://graph.facebook.com/v20.0/${instagramBusinessId}/media_publish`,
      {
        method: "POST",
        body: new URLSearchParams({
          creation_id: creationId,
          access_token: accessToken,
        }),
      }
    );

    const publishData = await publishRes.json();
    if (!publishRes.ok) {
      console.error("Instagram publish error:", publishData);
      const msg = publishData?.error?.message || "Ukendt fejl ved publish";
      throw new Error(`Kunne ikke publicere opslag: ${msg}`);
    }

    const publishedId = publishData.id as string | undefined;
    console.log("✅ [SERVER] Instagram post published:", publishedId);

    // 3) Fetch permalink
    let permalink: string | undefined;
    if (publishedId) {
      try {
        const permalinkRes = await fetch(
          `https://graph.facebook.com/v20.0/${publishedId}?fields=permalink&access_token=${accessToken}`
        );
        
        if (permalinkRes.ok) {
          const permalinkData = await permalinkRes.json();
          permalink = permalinkData.permalink;
          console.log("✅ [SERVER] Instagram permalink retrieved:", permalink);
        } else {
          console.warn("⚠️ [SERVER] Could not fetch Instagram permalink");
        }
      } catch (permalinkError) {
        console.warn("⚠️ [SERVER] Error fetching Instagram permalink:", permalinkError);
      }
    }

    return { success: true, id: publishedId, permalink };
  } catch (error) {
    console.error("❌ [SERVER] Instagram posting failed:", error);
    throw error;
  }
}
