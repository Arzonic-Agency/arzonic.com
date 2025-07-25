"use client";

import React, { useState } from "react";
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

  const handleFacebookConnect = async () => {
    setLoadingFacebook(true);
    try {
      const { data, error } = await supabase.auth.linkIdentity({
        provider: "facebook",
        options: {
          scopes: [
            "public_profile",
            "email",
            "pages_show_list",
            "pages_manage_posts",
            "pages_read_engagement",
          ].join(","),
          redirectTo: `https://arzonic.com/admin`,
        },
      });

      if (error) {
        console.error("Facebook linking error:", error);
        throw error;
      }

      // Refine `data` type to safely access `provider_token`
      if (
        typeof data === "object" &&
        data !== null &&
        "session" in data &&
        typeof data.session === "object" &&
        data.session !== null &&
        "provider_token" in data.session
      ) {
        const fbToken = (data.session as { provider_token: string })
          .provider_token;
        await supabase.auth.updateUser({
          data: { facebook_token: fbToken },
        });
        await fetchAndSetUserSession();
      }

      // Hvis linkIdentity ikke redirecter (sjældent), stop loading
      setLoadingFacebook(false);
    } catch (err: unknown) {
      console.error("Facebook linking fejl:", err);
      setLoadingFacebook(false);
      // You could add a toast notification here to inform the user
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
