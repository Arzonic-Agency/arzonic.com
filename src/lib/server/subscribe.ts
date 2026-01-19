"use server";

import { createAdminClient } from "@/utils/supabase/server";
import { createServerClientInstance } from "@/utils/supabase/server";

// ─────────────────────────────────────────────────────────────────────────────
// PUSH NOTIFICATIONS
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
  }
): Promise<{ success: boolean; sent: number; errors: number }> {
  // Tjek om web-push er tilgængelig
  let webpush: typeof import("web-push") | null = null;
  try {
    webpush = await import("web-push");
  } catch {
    console.warn("web-push ikke installeret - push notifications deaktiveret");
    return { success: false, sent: 0, errors: 0 };
  }

  const supabase = await createAdminClient();
  let sent = 0;
  let errors = 0;

  // Hent VAPID keys fra environment
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const vapidEmail = process.env.VAPID_EMAIL || "noreply@arzonic.com";

  if (!publicKey || !privateKey) {
    console.warn("VAPID keys ikke sat - push notifications deaktiveret");
    return { success: false, sent: 0, errors: 0 };
  }

  // Sæt VAPID detaljer
  webpush.setVapidDetails(`mailto:${vapidEmail}`, publicKey, privateKey);

  // Hent alle push subscriptions for brugere
  console.log(`🔍 Søger efter subscriptions for userIds:`, userIds);
  const { data: subscriptions, error: subError } = await supabase
    .from("push_subscriptions")
    .select("*")
    .in("user_id", userIds);

  console.log(`📊 Fandt ${subscriptions?.length || 0} subscriptions`, { subError, subscriptions });

  if (subError || !subscriptions || subscriptions.length === 0) {
    console.warn(`⚠️ Ingen subscriptions fundet eller fejl - stopper her`);
    return { success: true, sent: 0, errors: 0 };
  }

  // Hent push notification preferences for brugere
  const { data: members } = await supabase
    .from("members")
    .select("id, push_notifications_enabled")
    .in("id", userIds);

  const preferencesMap = new Map(
    (members || []).map((m) => [m.id, m.push_notifications_enabled ?? true])
  );

  console.log(`📤 Sender push notifications til ${subscriptions.length} subscriptions`);

  // Send til alle subscriptions hvor brugeren har notifications enabled
  for (const sub of subscriptions) {
    // Tjek om brugeren har notifications enabled (default true)
    const userEnabled = preferencesMap.get(sub.user_id) ?? true;
    if (!userEnabled) {
      console.log(`⏭️  Skip user ${sub.user_id} - notifications disabled`);
      continue; // Skip hvis brugeren har deaktiveret notifications
    }

    try {
      console.log(`📨 Sender til ${sub.endpoint.substring(0, 50)}...`);
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
        })
      );
      sent++;
      console.log(`✅ Sendt til user ${sub.user_id}`);
    } catch (error: unknown) {
      console.error(`❌ Fejl ved sending til user ${sub.user_id}:`, error);
      errors++;

      // Hvis subscription er ugyldig, slet den
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
  userAgent?: string
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

    // Brug upsert for at indsætte eller opdatere
    const { error } = await supabase
      .from("push_subscriptions")
      .upsert(
        {
          ...subscriptionData,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "endpoint",
          ignoreDuplicates: false,
        }
      );

    if (error) {
      console.error("Fejl ved gem/opdatering af push subscription:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error during push subscription save:", err);
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
  endpoint: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClientInstance();

  try {
    const { error } = await supabase
      .from("push_subscriptions")
      .delete()
      .eq("endpoint", endpoint);

    if (error) {
      console.error("Fejl ved sletning af push subscription:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error during push subscription delete:", err);
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
  enabled: boolean
): Promise<{ success: boolean; error?: string }> {
  // Verificer først at brugeren er logget ind og opdaterer sin egen række
  const supabase = await createServerClientInstance();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Bruger ikke autentificeret:", authError);
    return { success: false, error: "Ikke autentificeret" };
  }

  // Verificer at brugeren opdaterer sin egen række
  if (user.id !== userId) {
    console.error("Bruger forsøger at opdatere anden bruger");
    return { success: false, error: "Ikke autoriseret til at opdatere denne bruger" };
  }

  try {
    // Prøv først med server client (respekterer RLS)
    const { error } = await supabase
      .from("members")
      .update({ push_notifications_enabled: enabled })
      .eq("id", userId);

    // Hvis RLS blokerer, prøv med admin client
    if (error) {
      console.warn("RLS fejl, prøver med admin client:", error.message);
      const adminSupabase = await createAdminClient();
      const { error: adminError } = await adminSupabase
        .from("members")
        .update({ push_notifications_enabled: enabled })
        .eq("id", userId);

      if (adminError) {
        console.error("Fejl ved opdatering med admin client:", adminError);
        return { success: false, error: adminError.message };
      }
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error during preference update:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
