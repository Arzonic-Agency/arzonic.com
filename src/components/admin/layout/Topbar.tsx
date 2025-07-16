"use client";

import { signOut } from "@/lib/server/actions";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "@/i18n/config";
import { FaEllipsis, FaFacebook, FaRightFromBracket } from "react-icons/fa6";

import LanguageAdmin from "./LanguageAdmin";
import ThemeAdmin from "./ThemeAdmin";
import { fetchAndSetFacebookToken } from "@/lib/auth/readUserSession";
import { createClient } from "@/utils/supabase/client";
import { useAuthStore } from "@/lib/auth/useAuthStore";

interface PageTitleMapping {
  [key: string]: string;
}

const Topbar = () => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const supabase = createClient();

  const facebookToken = useAuthStore((state) => state.facebookToken);
  const [facebookChecked, setFacebookChecked] = useState(false);

  useEffect(() => {
    fetchAndSetFacebookToken().then(() => setFacebookChecked(true));
  }, []);

  const handleFacebookConnect = async () => {
    const { error } = await supabase.auth.linkIdentity({
      provider: "facebook",
      options: {
        redirectTo: "http://localhost:3000/admin",
      },
    });

    if (error) {
      console.error("Facebook linking fejl:", error.message);
    } else {
      console.log("Facebook forbundet til eksisterende bruger");
      fetchAndSetFacebookToken();
    }
  };

  const pageTitles: PageTitleMapping = {
    "/admin": t("overview"),
    "/admin/content": t("content"),
    "/admin/messages": t("customers"),
    "/admin/settings": t("settings"),
  };

  const currentTitle = pageTitles[pathname] || t("unknown_page");

  return (
    <div className="navbar bg-base-200 shadow-sm w-full rounded-md pl-5 h-14 flex items-center justify-between">
      <div className="flex-1">
        <a className="text-lg md:text-xl font-semibold tracking-wide">
          {currentTitle}
        </a>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-bottom dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-sm md:btn-md m-1 text-lg"
            aria-label={t("aria.topbar.moreOptions")}
          >
            <FaEllipsis />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg ring-1 ring-black ring-opacity-5"
          >
            <li>
              {" "}
              {facebookChecked ? (
                facebookToken ? (
                  <span className="pl-[14px] flex items-center gap-2 text-green-600">
                    <FaFacebook /> {t("Forbundet til JK")}
                  </span>
                ) : (
                  <button
                    onClick={handleFacebookConnect}
                    className="pl-[14px] flex items-center gap-2"
                    aria-label={t("aria.topbar.facebook")}
                  >
                    <FaFacebook /> {t("Forbind Facebook")}
                  </button>
                )
              ) : (
                <span className="pl-[14px] flex items-center gap-2 text-gray-400">
                  <FaFacebook /> {t("Tjekker...")}
                </span>
              )}
            </li>
            <li>
              <ThemeAdmin />
            </li>
            <li>
              <LanguageAdmin />
            </li>
            <li>
              <button
                onClick={signOut}
                className="pl-[14px] flex items-center gap-2"
                aria-label={t("aria.topbar.logout")}
              >
                <FaRightFromBracket /> {t("logout")}
              </button>
            </li>

            <div className="flex-col gap-10 w-full p-4 flex">
              <span className="text-zinc-500 text-[11px] flex items-center gap-0.5">
                © {new Date().getFullYear()} Powered by{" "}
                <span className="font-bold">Arzonic</span>
              </span>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
