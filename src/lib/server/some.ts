import { readUserSession } from "@/lib/auth/readUserSession";

export async function postToFacebookPage({
  message,
  imageUrls,
  pageId,
}: {
  message: string;
  imageUrls?: string[];
  pageId?: string; // Gør pageId optional så det kan komme fra brugeren
}): Promise<{ link?: string } | null> {
  console.log("🚀 [SERVER] Starting Facebook post...");
  console.log("📝 [SERVER] Message:", message);
  console.log("🖼️ [SERVER] Image URLs:", imageUrls);

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
    console.log("🔑 [SERVER] Token preview:", userSession.facebookToken);
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
    pagesData.data.forEach((p: any, index: number) => {
      console.log(
        `  ${index + 1}. ${p.name} (ID: ${p.id}) - Access: ${
          p.access_token ? "Yes" : "No"
        }`
      );
    });
  } else {
    console.log("  No pages data or invalid format");
  }

  const targetPageId = pageId || "649629024895494"; // Brug den medfølgende pageId eller default
  const page = pagesData.data?.find((p: any) => p.id === targetPageId);
  console.log("🔍 [SERVER] Target page found:", !!page);
  console.log("📃 [SERVER] Page details:", page);

  if (!page) {
    const availablePageIds =
      pagesData.data?.map((p: any) => p.id).join(", ") || "None";
    throw new Error(
      `Brugeren har ikke adgang til siden med ID ${targetPageId}. Tilgængelige sider: ${availablePageIds}. Sørg for at brugeren er admin/editor på Facebook siden og at appen har 'pages_manage_posts' permission.`
    );
  }

  const pageAccessToken = page.access_token;
  const selectedPageId = page.id;

  console.log("🔐 [SERVER] Page access token exists:", !!pageAccessToken);

  // 2. Lav opslag
  const postBody: any = {
    message,
    access_token: pageAccessToken,
  };

  // Add images if provided
  if (imageUrls && imageUrls.length > 0) {
    console.log("🖼️ [SERVER] Adding image to post...");
    if (imageUrls.length === 1) {
      // Single image
      postBody.url = imageUrls[0];
      console.log("📷 [SERVER] Single image URL:", imageUrls[0]);
    } else {
      // Multiple images - use attached_media (requires uploading images first)
      // For now, just use the first image URL
      postBody.url = imageUrls[0];
      console.log("📷 [SERVER] Multiple images, using first:", imageUrls[0]);
    }
  }

  console.log("📤 [SERVER] Post body:", postBody);
  console.log("🌐 [SERVER] Posting to Facebook...");

  // Convert to form data for Facebook API
  const formData = new FormData();
  Object.keys(postBody).forEach((key) => {
    formData.append(key, postBody[key]);
  });

  const postRes = await fetch(
    `https://graph.facebook.com/v19.0/${selectedPageId}/feed`,
    {
      method: "POST",
      body: formData, // Use FormData instead of JSON
    }
  );

  const postData = await postRes.json();
  console.log("📬 [SERVER] Facebook response status:", postRes.status);
  console.log("📬 [SERVER] Facebook response data:", postData);

  if (!postRes.ok) {
    console.error("❌ [SERVER] Facebook post failed:", postData);
    throw new Error(`Fejl ved opslag: ${postData.error?.message}`);
  }

  console.log("✅ [SERVER] Facebook post successful!");
  const result = {
    ...postData,
    link: postData.id ? `https://www.facebook.com/${postData.id}` : undefined,
  };
  console.log("🔗 [SERVER] Final result:", result);

  // Returnér postData og evt. link til opslaget
  return result;
}

export async function publishMessage(formData: FormData) {
  const message = formData.get("message") as string;
  const pageId = formData.get("pageId") as string | undefined;

  if (!message) throw new Error("Besked mangler");

  return await postToFacebookPage({ message, pageId });
}
