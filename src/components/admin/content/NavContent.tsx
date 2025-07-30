"use client";

import React, { useState, useEffect } from "react";
import {
  FaRegNewspaper,
  FaStar,
  FaSuitcase,
  FaFacebook,
} from "react-icons/fa6";
import Cases from "./cases/Cases";
import Reviews from "./reviews/Reviews";
import { useTranslation } from "react-i18next";
import News from "./news/News";
import { useAuthStore } from "@/lib/auth/useAuthStore";
import { createClient } from "@/utils/supabase/client";
import { fetchAndSetUserSession } from "@/lib/auth/clientAuth";

const NavContent = () => {
  const [activeTab, setActiveTab] = useState("news");
  const { t } = useTranslation();
  const supabase = createClient();
  const facebookLinked = useAuthStore((state) => state.facebookLinked);

  const [loadingFacebook, setLoadingFacebook] = useState(false);

  // Håndter token-udveksling efter Facebook redirect (server-side)
  const exchangeTokenAfterAuth = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.provider_token) {
        return;
      }

      // Kald server-side API til sikker token-udveksling
      const response = await fetch("/api/exchange-facebook-token", {
        method: "POST",
      });

      if (response.ok) {
        console.log("✅ Long-term Facebook token gemt");
        await fetchAndSetUserSession();
      }
    } catch (err) {
      console.error("Error during token exchange:", err); // Log the error
    }
  };

  // Tjek for Facebook token ved hver auth state ændring
  useEffect(() => {
    const checkForFacebookAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.provider_token && !facebookLinked) {
        await exchangeTokenAfterAuth();
      }
    };

    checkForFacebookAuth();

    // Lyt på auth state ændringer
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.provider_token && !facebookLinked) {
        exchangeTokenAfterAuth();
      }
    });

    return () => subscription.unsubscribe();
  }, [facebookLinked, exchangeTokenAfterAuth, supabase.auth]); // Add missing dependencies

  const handleFacebookConnect = async () => {
    setLoadingFacebook(true);
    try {
      const { error } = await supabase.auth.linkIdentity({
        provider: "facebook",
        options: {
          scopes: [
            "public_profile",
            "email",
            "pages_show_list",
            "pages_manage_posts",
            "pages_read_engagement",
          ].join(","),
          redirectTo: `${window.location.origin}/admin`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error("Error during Facebook connect:", err); // Log the error
      setLoadingFacebook(false);
    }
  };

  return (
    <div className="w-full">
      <div role="tablist" className="tabs sm:tabs-lg w-full  text-[15px]">
        <button
          role="tab"
          className={`tab gap-2  ${
            activeTab === "news"
              ? "tab-active bg-base-200 rounded-lg shadow-md"
              : ""
          }`}
          onClick={() => setActiveTab("news")}
          aria-label={t("aria.navContent.reviewsTab")}
        >
          <FaRegNewspaper />
          {t("news_more")}
        </button>
        <button
          role="tab"
          className={`tab gap-2  ${
            activeTab === "cases"
              ? "tab-active bg-base-200 rounded-lg shadow-md"
              : ""
          }`}
          onClick={() => setActiveTab("cases")}
          aria-label={t("aria.navContent.casesTab")}
        >
          <FaSuitcase />
          Cases
        </button>

        <button
          role="tab"
          className={`tab gap-2  ${
            activeTab === "reviews"
              ? "tab-active bg-base-200 rounded-lg shadow-md"
              : ""
          }`}
          onClick={() => setActiveTab("reviews")}
          aria-label={t("aria.navContent.reviewsTab")}
        >
          <FaStar />
          {t("reviews")}
        </button>
      </div>

      <div className="mt-3 md:mt-5">
        {activeTab === "news" && (
          <div className="relative bg-base-200 rounded-lg shadow-md">
            {!facebookLinked ? (
              <>
                {/* Blurred content */}
                <div className="filter blur-sm pointer-events-none opacity-50 p-5 md:p-7">
                  <News />
                </div>

                {/* Overlay with connection prompt */}
                <div className="absolute inset-0 flex items-center justify-center bg-base-100/10 backdrop-blur-sm rounded-lg">
                  <div className="card w-96 bg-base-200 shadow-xl">
                    <div className="card-body text-center gap-4">
                      <h2 className="card-title justify-center">
                        Kræver Facebook-adgang
                      </h2>
                      <p className="">
                        Du skal tilslutte din Facebook-konto for at kunne
                        administrere nyheder.
                      </p>
                      <div className="card-actions justify-center">
                        <button
                          onClick={handleFacebookConnect}
                          className={`btn btn-primary ${
                            loadingFacebook ? "loading" : ""
                          }`}
                          disabled={loadingFacebook}
                        >
                          <FaFacebook />
                          {loadingFacebook
                            ? "Omdirigerer..."
                            : t("connectToFacebook")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-5 md:p-7">
                <News />
              </div>
            )}
          </div>
        )}
        {activeTab === "cases" && (
          <div className="bg-base-200 rounded-lg shadow-md p-5 md:p-7">
            <Cases />
          </div>
        )}
        {activeTab === "reviews" && (
          <div className="bg-base-200  rounded-lg shadow-md p-5 md:p-7">
            <Reviews />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavContent;
