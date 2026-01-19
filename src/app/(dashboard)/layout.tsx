"use client";

import Navbar from "@/components/admin/layout/Navbar";
import Topbar from "@/components/admin/layout/Topbar";
import SettingsModal from "@/components/admin/layout/settings/UserSettingsModal";
import { UserSettingsModalProvider } from "@/components/admin/layout/settings/UserSettingsModalContext";
import { useEffect } from "react";
import { subscribeToPush } from "@/utils/push-notifications";
import { registerPushSubscription } from "@/lib/client/actions";
import { createClient } from "@/utils/supabase/client";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Service Worker og Push Notification Registration kun for admins
  useEffect(() => {
    const registerServiceWorkerForAdmins = async () => {
      if (!("serviceWorker" in navigator)) return;

      try {
        // Tjek om brugeren er admin
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { data: member } = await supabase
          .from("members")
          .select("role")
          .eq("id", user.id)
          .single();

        // Kun fortsæt hvis brugeren er admin eller developer
        if (!member || !["admin", "developer"].includes(member.role)) {
          return;
        }

        // Registrer service worker
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("Service Worker registreret for admin:", registration.scope);

        const vapidPublicKey = "BGLYSfFimmD-4FNiSeyBkE8RFXUU7QAX9RrH6mCC3vwauU_X8DdLUwZs0zabLs5J1cqmLb1RtJhECmKxA2r36u8";

        if (vapidPublicKey) {
          // Vent lidt for at sikre service worker er klar
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const subscription = await subscribeToPush(vapidPublicKey);
          if (subscription) {
            // Konverter til JSON først
            const subscriptionJson = subscription.toJSON();

            if (!subscriptionJson.endpoint || !subscriptionJson.keys) {
              console.error("Invalid subscription format");
              return;
            }

            // Gem subscription i Supabase
            const result = await registerPushSubscription(
              {
                endpoint: subscriptionJson.endpoint,
                keys: {
                  p256dh: subscriptionJson.keys.p256dh!,
                  auth: subscriptionJson.keys.auth!,
                },
              },
              user.id,
              navigator.userAgent
            );

            if (result.success) {
              console.log("Push subscription gemt i Supabase");
            } else {
              console.error("Fejl ved gemning af subscription:", result.error);
            }
          }
        }
      } catch (error) {
        console.error("Fejl ved registrering af service worker:", error);
      }
    };

    registerServiceWorkerForAdmins();
  }, []);

  return (
    <UserSettingsModalProvider>
      <div className="flex flex-col sm:flex-row sm:h-lvh h-dvh relative bg-base-100">
        <Navbar />
        <div className="p-3 w-full sm:pl-[238px] xl:pl-[300px] flex flex-col gap-3 md:gap-5 pb-28 md:pb-0">
          <Topbar />
          {children}
        </div>
        <SettingsModal />
      </div>
    </UserSettingsModalProvider>
  );
}
