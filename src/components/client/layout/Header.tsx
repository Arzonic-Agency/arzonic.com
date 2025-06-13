"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaGripLines, FaInstagram, FaXmark } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Language from "./Language";
import LanguageAdmin from "@/components/admin/layout/LanguageAdmin";

const Header = () => {
  const pathname = usePathname();
  const { t } = useTranslation();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById("solutions-dropdown");
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCloseDrawer = () => {
    const drawerCheckbox = document.getElementById(
      "my-drawer-4"
    ) as HTMLInputElement;
    if (drawerCheckbox) {
      drawerCheckbox.checked = false;
    }
  };

  return (
    <div className="navbar absolute top-0 inset-x-0 z-50 max-w-[1536px] mx-auto md:py-5 py-7 bg-base-100 md:bg-transparent">
      <div className="flex-1">
        <Link
          href="/"
          className="pl-4 flex items-center gap-2"
          aria-label={t("aria.navigation.linkToHome")}
        >
          <Image
            src="/icon-192x192.png"
            alt={t("Header.logoAlt")}
            width={60}
            height={60}
            className="h-10 w-10 md:h-14 md:w-14 rounded-full"
            priority
          />
          <span className="font-bold text-2xl md:text-3xl tracking-wider">
            {t("Header.brandName")}
          </span>
        </Link>
      </div>
      <nav className="flex-none">
        <ul className="menu hidden md:flex menu-horizontal text-lg font-bold gap-3 md:gap-5 items-center">
          <li
            className="relative"
            id="solutions-dropdown"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <Link
              href="/solutions"
              aria-label={t("aria.navigation.linkToSolutions")}
            >
              {t("Header.solutions")}
            </Link>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-10 left-0 bg-base-100 shadow-xl w-52 px-2 py-3 z-30 flex flex-col items-start gap-3 rounded-xl"
                >
                  <li className="w-full">
                    <Link href="/solutions/custom-websites">
                      {t("Header.dropdown.customWebsites")}
                    </Link>
                  </li>
                  <li className="w-full">
                    <Link href="/solutions/web-applications">
                      {t("Header.dropdown.webApplications")}
                    </Link>
                  </li>
                  <li className="w-full">
                    <Link href="/solutions/3d-visualization">
                      {t("Header.dropdown.visualization")}
                    </Link>
                  </li>
                  <li className="w-full">
                    <Link href="/solutions/design-animation">
                      {t("Header.dropdown.designAnimation")}
                    </Link>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
          <li>
            <Link href="/cases" aria-label={t("aria.navigation.linkToCases")}>
              {t("Header.cases")}
            </Link>
          </li>
          <li>
            <Link
              href="/pricing"
              aria-label={t("aria.navigation.linkToContact")}
            >
              {t("Header.pricing")}
            </Link>
          </li>
          <li>
            <Link
              href="/get-started"
              className="btn btn-primary text-base"
              aria-label={t("aria.navigation.getStarted")}
            >
              {t("Header.getStarted")}
            </Link>
          </li>
          <li>
            <Language />
          </li>
        </ul>

        {/* Mobile drawer */}
        <div className="drawer drawer-end flex md:hidden items-center">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label
              htmlFor="my-drawer-4"
              className="drawer-button btn btn-ghost"
            >
              <FaGripLines size={30} />
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-4"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu bg-base-100 min-h-full w-80 p-4 pt-24 gap-2 items-center">
              <li className="absolute top-6 right-3">
                <label htmlFor="my-drawer-4">
                  <FaXmark size={30} />
                </label>
              </li>
              <li className="text-xl font-semibold">
                <Link
                  href="/solutions"
                  onClick={handleCloseDrawer}
                  aria-label={t("aria.navigation.linkToSolutions")}
                >
                  {t("Header.solutions")}
                </Link>
              </li>
              <li className="text-xl font-semibold">
                <Link
                  href="/cases"
                  onClick={handleCloseDrawer}
                  aria-label={t("aria.navigation.linkToCases")}
                >
                  {t("Header.cases")}
                </Link>
              </li>
              <li className="text-xl font-semibold">
                <Link
                  href="/pricing"
                  onClick={handleCloseDrawer}
                  aria-label={t("aria.navigation.linkToContact")}
                >
                  {t("Header.pricing")}
                </Link>
              </li>
              <li className="text-xl font-semibold">
                <Link
                  href="/contact"
                  onClick={handleCloseDrawer}
                  aria-label={t("aria.navigation.linkToContact")}
                >
                  {t("Header.contact")}
                </Link>
              </li>
              <li>
                <Link
                  href="/get-started"
                  className="btn btn-primary py-2 mt-4 text-neutral-content"
                  onClick={handleCloseDrawer}
                  aria-label={t("aria.navigation.getStarted")}
                >
                  {t("Header.getStarted")}
                </Link>
              </li>
              <div className="flex flex-col items-center gap-6 flex-1 justify-center w-full">
                <span className="text-lg font-bold">
                  {t("Header.followUs")}
                </span>
                <div className="flex gap-6">
                  <Link
                    href="https://www.facebook.com/profile.php?id=61575249251500"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-14 h-14 shadow-lg rounded-full flex items-center justify-center">
                      <FaFacebook className="text-3xl text-secondary" />
                    </div>
                    <span className="text-secondary font-bold">
                      {t("Header.facebook")}
                    </span>
                  </Link>
                  <Link
                    href="https://www.instagram.com/arzonic.agency/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-14 h-14 shadow-lg rounded-full flex items-center justify-center">
                      <FaInstagram className="text-3xl text-secondary" />
                    </div>
                    <span className="text-secondary font-bold">
                      {t("Header.instagram")}
                    </span>
                  </Link>
                </div>
              </div>
              <li className="mb-7">
                <LanguageAdmin />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
