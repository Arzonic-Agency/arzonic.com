import { createServerClientInstance } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = await createServerClientInstance();

    // Hent current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    const shortLivedToken = session.provider_token;

    if (!shortLivedToken) {
      return NextResponse.json(
        { error: "No provider token found" },
        { status: 400 }
      );
    }

    // Udveksle til long-lived token via Facebook API (server-side)
    const tokenExchange = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?` +
        new URLSearchParams({
          grant_type: "fb_exchange_token",
          client_id: process.env.FB_APP_ID!,
          client_secret: process.env.FB_APP_SECRET!,
          fb_exchange_token: shortLivedToken,
        })
    );

    const tokenResponse = await tokenExchange.json();

    if (!tokenResponse.access_token) {
      return NextResponse.json(
        { error: "Failed to exchange token", details: tokenResponse },
        { status: 400 }
      );
    }

    const longLivedToken = tokenResponse.access_token;

    // Gem long-lived token i user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        facebook_token: longLivedToken,
      },
    });

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to save token", details: updateError },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Long-term token saved successfully",
    });
  } catch (error) {
    console.error("Token exchange error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
