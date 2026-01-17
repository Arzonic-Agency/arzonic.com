import { savePushSubscription } from "@/lib/server/actions";
import { createServerClientInstance } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint, keys } = body;

    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      return NextResponse.json(
        { success: false, message: "Invalid subscription data" },
        { status: 400 }
      );
    }

    // Hent user ID hvis brugeren er logget ind
    const supabase = await createServerClientInstance();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Hent user agent fra request headers
    const userAgent = request.headers.get("user-agent") || undefined;

    const result = await savePushSubscription(
      {
        endpoint,
        keys: {
          p256dh: keys.p256dh,
          auth: keys.auth,
        },
      },
      user?.id,
      userAgent
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error || "Failed to save subscription" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in push subscribe API:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
