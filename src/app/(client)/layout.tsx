"use client";

import Header from "@/components/client/layout/Header";
import { FaAngleUp } from "react-icons/fa6";
import { useEffect, useState } from "react";
import Footer from "@/components/client/layout/Footer";
import Script from "next/script";
import { DefaultSeo } from "next-seo";
import ScreenFade from "@/components/client/layout/ScreenFade";
import { subscribeToPush } from "@/utils/push-notifications";
import { registerPushSubscription } from "@/lib/client/actions";
import { useTranslation } from "react-i18next";
import { FaCookieBite } from "react-icons/fa6";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useTranslation();
  const [showScroll, setShowScroll] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {
    // Check if user has already seen the cookie banner
    const hasSeenCookie = localStorage.getItem("cookieBannerSeen");
    if (!hasSeenCookie) {
      // Show banner after a short delay
      const timer = setTimeout(() => setShowCookieBanner(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissCookieBanner = () => {
    localStorage.setItem("cookieBannerSeen", "true");
    setShowCookieBanner(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Service Worker og Push Notification Registration
  useEffect(() => {
    const registerServiceWorker = async () => {
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");
          console.log("Service Worker registreret:", registration.scope);

          // Hvis VAPID key er sat, prøv at subscribe til push notifications
          const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
          if (vapidPublicKey) {
            // Vent lidt for at sikre service worker er klar
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const subscription = await subscribeToPush(vapidPublicKey);
            if (subscription) {
              // Gem subscription i Supabase
              const result = await registerPushSubscription(subscription);
              if (result.success) {
                console.log("Push subscription gemt i Supabase");
              } else {
                console.error("Fejl ved gemning af subscription:", result.error);
              }
            }
          } else {
            console.warn(
              "NEXT_PUBLIC_VAPID_PUBLIC_KEY ikke sat - push notifications deaktiveret"
            );
          }
        } catch (error) {
          console.error("Fejl ved registrering af service worker:", error);
        }
      }
    };

    registerServiceWorker();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Script
        async
        defer
        src="https://stats.arzonic.com/script.js"
        data-website-id="07686da1-b9ea-4c1c-a961-404432a84e2c"
      />
      <DefaultSeo
        titleTemplate="%s - Arzonic"
        defaultTitle="Arzonic – Danish Software Agency for Modern Web Apps"
        description="Building modern web applications, dashboards, and custom digital solutions for ambitious small and medium-sized businesses."
        openGraph={{
          type: "website",
          locale: "en_US",
          url: "https://arzonic.com",
          siteName: "Arzonic",
        }}
      />
      <div className="sm:h-lvh h-dvh max-w-7xl mx-auto pt-[101px]">
        <header>
          <Header />
        </header>
        <main>{children}</main>
        <footer>
          <Footer />
        </footer>
        {showScroll && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-9 right-8 p-2 bg-base-100 ring-2 ring-secondary text-secondary rounded-lg shadow-lg z-50  cursor-pointer block md:hidden"
          >
            <FaAngleUp size={17} />
          </button>
        )}
        
        {/* Cookie Banner */}
        {showCookieBanner && (
          <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="card bg-base-200 ring-1 ring-base-300 shadow-xl">
              <div className="card-body p-4 items-center text-center gap-3">
                <div className="flex items-center gap-2">
                  <FaCookieBite className="text-xl text-secondary" />
                  <h2 className="card-title text-base">{t("CookieBanner.title")}!</h2>
                </div>
                <p className="text-sm text-zinc-400">{t("CookieBanner.message")}</p>
                <div className="card-actions">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={dismissCookieBanner}
                  >
                    {t("CookieBanner.button")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <ScreenFade />
      </div>
    </>
  );
}
