import { createClient } from "@/utils/supabase/client";

export async function postToFacebookPage({
  message,
  imageUrls,
}: {
  message: string;
  imageUrls?: string[];
}) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userAccessToken = session?.provider_token;
  if (!userAccessToken) {
    console.warn(
      "Facebook token not available - user may not be logged in with Facebook"
    );
    throw new Error(
      "Facebook token mangler - log ind med Facebook for at dele opslag"
    );
  }

  // 1. Hent sider brugeren har adgang til
  const pagesRes = await fetch(
    `https://graph.facebook.com/v19.0/me/accounts?access_token=${userAccessToken}`
  );
  const pagesData = await pagesRes.json();

  const page = pagesData.data.find(
    (p: any) => p.name === "Junkers køreskole" // <-- brug evt. page.id i stedet
  );
  if (!page) throw new Error("Brugeren har ikke adgang til siden");

  const pageAccessToken = page.access_token;
  const pageId = page.id;

  // 2. Lav opslag
  const postBody: any = {
    message,
    access_token: pageAccessToken,
  };

  // Add images if provided
  if (imageUrls && imageUrls.length > 0) {
    if (imageUrls.length === 1) {
      // Single image
      postBody.url = imageUrls[0];
    } else {
      // Multiple images - use attached_media (requires uploading images first)
      // For now, just use the first image URL
      postBody.url = imageUrls[0];
    }
  }

  const postRes = await fetch(
    `https://graph.facebook.com/v19.0/${pageId}/feed`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postBody),
    }
  );

  const postData = await postRes.json();
  if (!postRes.ok)
    throw new Error(`Fejl ved opslag: ${postData.error?.message}`);

  // Returnér postData og evt. link til opslaget
  return {
    ...postData,
    link: postData.id ? `https://www.facebook.com/${postData.id}` : undefined,
  };
}

export async function publishMessage(formData: FormData) {
  const message = formData.get("message") as string;
  if (!message) throw new Error("Besked mangler");

  return await postToFacebookPage({ message });
}
