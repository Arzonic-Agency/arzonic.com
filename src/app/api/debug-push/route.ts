import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";

/**
 * Debug endpoint til at tjekke push notification setup
 * Besøg: /api/debug-push
 */
export async function GET() {
  const supabase = await createAdminClient();

  // 1. Tjek VAPID keys
  const hasPublicKey = !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const hasPrivateKey = !!process.env.VAPID_PRIVATE_KEY;
  const hasEmail = !!process.env.VAPID_EMAIL;

  // 2. Hent alle push subscriptions
  const { data: subscriptions, error: subError } = await supabase
    .from("push_subscriptions")
    .select("*");

  // 3. Hent alle admins
  const { data: admins, error: adminError } = await supabase
    .from("members")
    .select("id, role, push_notifications_enabled")
    .in("role", ["admin", "developer"]);

  // 4. Tjek web-push pakke
  let webPushInstalled = false;
  try {
    await import("web-push");
    webPushInstalled = true;
  } catch {
    webPushInstalled = false;
  }

  return NextResponse.json({
    environment: {
      hasPublicKey,
      hasPrivateKey,
      hasEmail,
      publicKeyPreview: hasPublicKey
        ? process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.substring(0, 20) + "..."
        : null,
    },
    webPushInstalled,
    subscriptions: {
      count: subscriptions?.length || 0,
      data: subscriptions || [],
      error: subError?.message || null,
    },
    admins: {
      count: admins?.length || 0,
      data: admins?.map((a) => ({
        id: a.id,
        role: a.role,
        pushEnabled: a.push_notifications_enabled ?? true,
        hasSubscription: subscriptions?.some((s) => s.user_id === a.id) || false,
      })),
      error: adminError?.message || null,
    },
    issues: [],
  });
}
