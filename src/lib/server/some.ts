import { readUserSession } from "@/lib/auth/readUserSession";

const REQUIRED_PAGE_ID = "716528814879125";

export async function validateFacebookPageAccess(): Promise<{
  hasAccess: boolean;
  pageName?: string;
  error?: string;
}> {
  console.log("🔍 [SERVER] Validating Facebook page access...");

  const userSession = await readUserSession();

  if (!userSession?.facebookLinked || !userSession.facebookToken) {
    return { hasAccess: false, error: "Facebook not connected" };
  }

  try {
    const pagesRes = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?access_token=${userSession.facebookToken}`
    );

    if (!pagesRes.ok) {
      const errorText = await pagesRes.text();
      console.error(
        "❌ [SERVER] Failed to fetch pages:",
        pagesRes.status,
        errorText
      );
      return { hasAccess: false, error: "Failed to fetch Facebook pages" };
    }

    const pagesData = await pagesRes.json();
    const requiredPage = pagesData.data?.find(
      (p: { id: string; name: string; access_token?: string }) =>
        p.id === REQUIRED_PAGE_ID && p.access_token
    );

    if (requiredPage) {
      console.log(
        "✅ [SERVER] User has access to required page:",
        requiredPage.name
      );
      return {
        hasAccess: true,
        pageName: requiredPage.name,
      };
    } else {
      console.log("❌ [SERVER] User does not have access to required page");
      const availablePages =
        pagesData.data
          ?.map((p: { name: string; id: string }) => `${p.name} (${p.id})`)
          .join(", ") || "None";

      return {
        hasAccess: false,
        error: `Ingen adgang til den krævede Facebook side. Du skal være admin/editor på siden for at kunne oprette opslag. Tilgængelige sider: ${availablePages}`,
      };
    }
  } catch (error) {
    console.error("❌ [SERVER] Error validating page access:", error);
    return {
      hasAccess: false,
      error: "Fejl ved validering af Facebook adgang",
    };
  }
}

export async function postToFacebookPage({
  message,
  imageUrls,
}: {
  message: string;
  imageUrls?: string[];
}): Promise<{ link?: string } | null> {
  console.log("🚀 [SERVER] Starting Facebook post...");
  console.log("📝 [SERVER] Message:", message);
  console.log("🖼️ [SERVER] Image URLs:", imageUrls);

  // First validate access to the required page
  const validation = await validateFacebookPageAccess();
  if (!validation.hasAccess) {
    throw new Error(validation.error || "Ingen adgang til Facebook siden");
  }

  // Use readUserSession to get Facebook token
  const userSession = await readUserSession();

  if (!userSession) {
    throw new Error("User not authenticated");
  }

  console.log("👤 [SERVER] User exists:", !!userSession.user);
  console.log("🔗 [SERVER] Facebook linked:", userSession.facebookLinked);
  console.log(
    "🔑 [SERVER] Facebook token exists:",
    !!userSession.facebookToken
  );

  // Debug the actual token value (first few chars only for security)
  if (userSession.facebookToken) {
    console.log(
      "🔑 [SERVER] Token preview:",
      userSession.facebookToken.substring(0, 10) + "…"
    );
  }

  if (!userSession.facebookLinked) {
    throw new Error(
      "Du skal logge ind med Facebook for at dele opslag. Gå til indstillinger og tilknyt din Facebook konto."
    );
  }

  const userAccessToken = userSession.facebookToken;
  if (!userAccessToken) {
    throw new Error(
      "Facebook token er udløbet eller ikke tilgængeligt. Log venligst ind med Facebook igen eller gå til indstillinger for at genopfriske din Facebook forbindelse."
    );
  }

  // 1. Hent sider brugeren har adgang til
  console.log("📄 [SERVER] Fetching Facebook pages...");
  const pagesRes = await fetch(
    `https://graph.facebook.com/v19.0/me/accounts?access_token=${userAccessToken}`
  );

  if (!pagesRes.ok) {
    const errorText = await pagesRes.text();
    console.error(
      "❌ [SERVER] Failed to fetch pages:",
      pagesRes.status,
      errorText
    );
    throw new Error(
      `Failed to fetch Facebook pages: ${pagesRes.status} - ${errorText}`
    );
  }

  const pagesData = await pagesRes.json();
  console.log("📄 [SERVER] Pages data:", pagesData);

  // Log alle tilgængelige sider for debugging
  console.log("📋 [SERVER] Available pages:");
  if (pagesData.data && Array.isArray(pagesData.data)) {
    pagesData.data.forEach(
      (
        p: { name: string; id: string; access_token?: string },
        index: number
      ) => {
        console.log(
          `  ${index + 1}. ${p.name} (ID: ${p.id}) - Access: ${
            p.access_token ? "Yes" : "No"
          }`
        );
      }
    );
  } else {
    console.log("  No pages data or invalid format");
  }

  // Only use the required page ID - ignore any passed pageId for security
  const targetPageId = REQUIRED_PAGE_ID;
  const page = pagesData.data?.find(
    (p: { id: string }) => p.id === targetPageId
  );
  console.log("🔍 [SERVER] Target page found:", !!page);
  console.log("📃 [SERVER] Page details:", page);

  if (!page) {
    const availablePageIds =
      pagesData.data?.map((p: { id: string }) => p.id).join(", ") || "None";
    throw new Error(
      `Brugeren har ikke adgang til siden med ID ${targetPageId}. Tilgængelige sider: ${availablePageIds}. Sørg for at brugeren er admin/editor på Facebook siden og at appen har 'pages_manage_posts' permission.`
    );
  }

  const pageAccessToken = page.access_token!;
  const selectedPageId = page.id;

  console.log("🔐 [SERVER] Page access token exists:", !!pageAccessToken);

  // 2. Lav opslag
  // Hvis du kun har ét billede – brug /photos direkte:
  if (imageUrls && imageUrls.length === 1) {
    console.log("🖼️ [SERVER] Single image post via /photos endpoint");
    const photoRes = await fetch(
      `https://graph.facebook.com/v19.0/${selectedPageId}/photos`,
      {
        method: "POST",
        body: new URLSearchParams({
          url: imageUrls[0],
          message: message, // Add message/caption to single image
          published: "true",
          access_token: pageAccessToken,
        }),
      }
    );
    const photoData = await photoRes.json();
    if (!photoRes.ok) {
      throw new Error(`Fejl ved foto-opload: ${photoData.error?.message}`);
    }
    // Returnér link til opslag
    return {
      link: photoData.post_id
        ? `https://www.facebook.com/${photoData.post_id}`
        : undefined,
    };
  }

  // Hvis du har flere eller ingen billeder – brug /feed:
  const postBody: Record<string, string> = {
    message,
    access_token: pageAccessToken,
  };

  if (imageUrls && imageUrls.length > 1) {
    console.log(
      "🖼️ [SERVER] Flere billeder – uploader unpublished og samler attached_media"
    );
    // 1) Upload hver enkelt billed unpublished
    const photoIds: string[] = [];
    for (const url of imageUrls) {
      const res = await fetch(
        `https://graph.facebook.com/v19.0/${selectedPageId}/photos`,
        {
          method: "POST",
          body: new URLSearchParams({
            url,
            published: "false", // Keep unpublished for multiple images
            access_token: pageAccessToken,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(`Kunne ikke uploade billede: ${data.error?.message}`);
      }
      photoIds.push(data.id);
    }
    // 2) Byg attached_media
    const attached = photoIds.map((id) => ({ media_fbid: id }));
    postBody.attached_media = JSON.stringify(attached);
  }

  // Fallback: ingen billeder eller single image i feed
  console.log("📤 [SERVER] Post body:", postBody);
  const formData = new FormData();
  Object.entries(postBody).forEach(([k, v]) => formData.append(k, v || ""));

  console.log("🌐 [SERVER] Posting to /feed...");
  const postRes = await fetch(
    `https://graph.facebook.com/v19.0/${selectedPageId}/feed`,
    {
      method: "POST",
      body: formData,
    }
  );
  const postData = await postRes.json();
  console.log("📬 [SERVER] Facebook response:", postRes.status, postData);

  if (!postRes.ok) {
    console.error("❌ [SERVER] Facebook post failed:", postData);
    throw new Error(`Fejl ved opslag: ${postData.error?.message}`);
  }

  console.log("✅ [SERVER] Facebook post successful!");
  return {
    link: postData.id ? `https://www.facebook.com/${postData.id}` : undefined,
  };
}

export async function publishMessage(formData: FormData) {
  const message = formData.get("message") as string;

  if (!message) throw new Error("Besked mangler");

  return await postToFacebookPage({ message });
}

export async function updateFacebookPost({
  postId,
  message,
}: {
  postId: string;
  message: string;
}): Promise<{ success: boolean; link?: string }> {
  console.log("🔄 [SERVER] Starting Facebook post update...");
  console.log("🆔 [SERVER] Post ID:", postId);
  console.log("📝 [SERVER] New message:", message);

  const userSession = await readUserSession();

  if (!userSession?.facebookLinked || !userSession.facebookToken) {
    throw new Error("Facebook forbindelse ikke tilgængelig");
  }

  // Get page info
  const pagesRes = await fetch(
    `https://graph.facebook.com/v19.0/me/accounts?access_token=${userSession.facebookToken}`
  );

  if (!pagesRes.ok) {
    throw new Error("Kunne ikke hente Facebook sider");
  }

  const pagesData = await pagesRes.json();
  const targetPageId = "716528814879125"; // Your page ID
  const page = pagesData.data?.find(
    (p: { id: string }) => p.id === targetPageId
  );

  if (!page) {
    throw new Error("Ingen adgang til Facebook siden");
  }

  // Update the post
  const updateRes = await fetch(`https://graph.facebook.com/v19.0/${postId}`, {
    method: "POST",
    body: new URLSearchParams({
      message,
      access_token: page.access_token,
    }),
  });

  const updateData = await updateRes.json();

  if (!updateRes.ok) {
    console.error("❌ [SERVER] Facebook update failed:", updateData);
    throw new Error(`Fejl ved opdatering: ${updateData.error?.message}`);
  }

  console.log("✅ [SERVER] Facebook post updated successfully!");
  return {
    success: true,
    link: `https://www.facebook.com/${postId}`,
  };
}

export async function deleteFacebookPost(
  postId: string
): Promise<{ success: boolean }> {
  console.log("🗑️ [SERVER] Starting Facebook post deletion...");
  console.log("🆔 [SERVER] Post ID:", postId);

  const userSession = await readUserSession();

  if (!userSession?.facebookLinked || !userSession.facebookToken) {
    throw new Error("Facebook forbindelse ikke tilgængelig");
  }

  // Get page info
  const pagesRes = await fetch(
    `https://graph.facebook.com/v19.0/me/accounts?access_token=${userSession.facebookToken}`
  );

  if (!pagesRes.ok) {
    throw new Error("Kunne ikke hente Facebook sider");
  }

  const pagesData = await pagesRes.json();
  const targetPageId = "716528814879125"; // Your page ID
  const page = pagesData.data?.find(
    (p: { id: string }) => p.id === targetPageId
  );

  if (!page) {
    throw new Error("Ingen adgang til Facebook siden");
  }

  // Delete the post
  const deleteRes = await fetch(`https://graph.facebook.com/v19.0/${postId}`, {
    method: "DELETE",
    body: new URLSearchParams({
      access_token: page.access_token,
    }),
  });

  if (!deleteRes.ok) {
    const errorData = await deleteRes.json();
    console.error("❌ [SERVER] Facebook deletion failed:", errorData);
    throw new Error(`Fejl ved sletning: ${errorData.error?.message}`);
  }

  console.log("✅ [SERVER] Facebook post deleted successfully!");
  return { success: true };
}
