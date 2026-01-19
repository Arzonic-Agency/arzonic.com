import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";
import { sendPushNotificationsToUsers } from "@/lib/server/subscribe";

/**
 * Test endpoint til at sende en push notification til dig selv
 * Besøg: /api/test-push?userId=DIN_USER_ID
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "userId query parameter er påkrævet. Brug: /api/test-push?userId=DIN_USER_ID" },
      { status: 400 }
    );
  }

  const supabase = await createAdminClient();

  // Tjek om brugeren har en subscription
  const { data: subscriptions } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", userId);

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({
      success: false,
      error: "Ingen push subscription fundet for denne bruger",
      hint: "Åbn appen i browseren og accepter push notifications først",
    });
  }

  // Send test notification
  try {
    const result = await sendPushNotificationsToUsers([userId], {
      title: "Test Push Notification 🔔",
      body: "Hvis du ser denne besked, virker push notifications!",
      tag: "test-notification",
    });

    return NextResponse.json({
      success: true,
      result,
      subscriptions: subscriptions.length,
      message: "Push notification sendt! Tjek din telefon/browser",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Ukendt fejl",
      subscriptions: subscriptions.length,
    });
  }
}
