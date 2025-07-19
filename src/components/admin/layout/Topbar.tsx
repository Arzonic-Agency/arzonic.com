"use client";

import React, { useEffect, useRef, useState } from "react";
import { signOut } from "@/lib/server/actions";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import "@/i18n/config";
import { FaEllipsis, FaFacebook, FaRightFromBracket } from "react-icons/fa6";

import LanguageAdmin from "./LanguageAdmin";
import ThemeAdmin from "./ThemeAdmin";
import {
  fetchAndSetUserSession,
  disconnectFacebook,
  setupAuthListener,
} from "@/lib/auth/clientAuth";
import { createClient } from "@/utils/supabase/client";
import { useAuthStore } from "@/lib/auth/useAuthStore";

const Topbar = () => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const supabase = createClient();

  const facebookLinked = useAuthStore((state) => state.facebookLinked);
  const [loadingState, setLoadingState] = useState<
    "idle" | "connecting" | "disconnecting"
  >("idle");
  const [isDisconnectingView, setIsDisconnectingView] = useState(false);

  const dropdownRef = useRef<HTMLUListElement>(null);

  // Reset visning når facebookLinked ændrer sig
  useEffect(() => {
    if (!facebookLinked) setIsDisconnectingView(false);
  }, [facebookLinked]);

  // Luk disconnect-view når man klikker udenfor dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDisconnectingView &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDisconnectingView(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDisconnectingView]);

  useEffect(() => {
    const sub = setupAuthListener();
    fetchAndSetUserSession();
    return () => sub.unsubscribe();
  }, []);

  const handleFacebookConnect = async () => {
    setLoadingState("connecting");
    try {
      await supabase.auth.linkIdentity({
        provider: "facebook",
        options: {
          scopes: "public_profile,email,pages_show_list,pages_manage_posts",
          redirectTo: `${window.location.origin}/admin`,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Facebook linking fejl:", error.message);
      } else {
        console.error("An unknown error occurred during Facebook linking.");
      }
    } finally {
      setLoadingState("idle");
    }
  };

  const handleFacebookDisconnect = async () => {
    setLoadingState("disconnecting");
    const result = await disconnectFacebook();
    if (result.success) {
      await fetchAndSetUserSession();
    }
    setLoadingState("idle");
  };

  const pageTitles: Record<string, string> = {
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
            className="btn btn-ghost md:btn-md m-1 text-lg"
            aria-label={t("aria.topbar.moreOptions")}
          >
            <FaEllipsis size={20} />
          </div>
          <ul
            ref={dropdownRef}
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg ring-1 ring-base-300 ring-opacity-5"
          >
            <li>
              {facebookLinked ? (
                isDisconnectingView ? (
                  <button
                    onClick={handleFacebookDisconnect}
                    className={`flex items-center gap-2 btn btn-ghost text-error transition-all duration-300 ${
                      loadingState === "disconnecting"
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                  >
                    <FaFacebook />
                    <span className="text-xs">
                      {loadingState === "disconnecting"
                        ? t("disconnecting")
                        : t("disconnect")}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsDisconnectingView(true)}
                    className="flex items-center gap-2 btn transition-all duration-300"
                  >
                    <FaFacebook />
                    {t("connected")}
                    <div className="inline-grid *:[grid-area:1/1] ml-1">
                      <div className="status status-primary animate-ping"></div>
                      <div className="status status-primary"></div>
                    </div>
                  </button>
                )
              ) : (
                <button
                  onClick={handleFacebookConnect}
                  className={`flex items-center gap-2 transition-all duration-300 ${
                    loadingState === "connecting"
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
                >
                  <span className="pl-[2px] flex gap-2 items-center">
                    <FaFacebook />
                    {loadingState === "connecting"
                      ? t("connecting")
                      : t("connectToFacebook")}
                  </span>
                </button>
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
