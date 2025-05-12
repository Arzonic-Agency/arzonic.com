"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBars, FaFacebook, FaInstagram, FaXmark } from "react-icons/fa6";
import Image from "next/image";
import Language from "./Language";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="navbar absolute top-0 bg-ghost inset-x-0 z-50 max-w-[1536px] mx-auto py-5 flex justify-between items-center">
      <div className="flex-1">
        <Link className="cursor-pointer pl-4 flex items-center gap-2" href="/">
          <Image
            src="/logo-arzonic.png"
            alt=""
            width={60}
            height={60}
            className="h-10 w-10 md:h-14 md:w-14 rounded-full"
          />
          <span className="font-bold text-2xl md:text-3xl tracking-wider">
            {t("Header.brandName")}
          </span>
        </Link>
      </div>
      <nav className="flex-none">
        <ul className="menu w-full text-lg menu-horizontal font-bold md:font-medium gap-3 md:gap-5 items-center hidden md:flex">
          <li
            className="relative"
            id="solutions-dropdown"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className="cursor-pointer">{t("Header.solutions")}</button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-10 left-0 ml-0 bg-base-100 shadow-xl w-52 px-2 py-3 z-30 flex flex-col text-[15px] items-start gap-3 rounded-xl menu menu-vertical"
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
            <Link href="/cases">{t("Header.cases")}</Link>
          </li>
          <li>
            <Link href="/contact">{t("Header.contact")}</Link>
          </li>
          <li>
            <Link href="/get-started" className="btn btn-primary text-base">
              {t("Header.getStarted")}
            </Link>
          </li>
          <li>
            <Language />
          </li>
        </ul>

        {/* Mobile menu */}
        <div className="drawer drawer-end flex md:hidden">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label
              htmlFor="my-drawer-4"
              className="drawer-button btn btn-ghost"
            >
              <FaBars size={30} />
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-4"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu menu-lg bg-base-100 text-base-content min-h-full w-96 p-4 pt-20 gap-2 items-center relative">
              <li className="absolute top-6 right-3">
                <label htmlFor="my-drawer-4">
                  <FaXmark size={30} />
                </label>
              </li>
              <li className="text-2xl font-bold">
                <Link href="/solutions" onClick={handleCloseDrawer}>
                  {t("Header.solutions")}
                </Link>
              </li>
              <li className="text-2xl font-bold">
                <Link href="/cases" onClick={handleCloseDrawer}>
                  {t("Header.cases")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="btn btn-primary text-neutral-content py-2 mt-4"
                  onClick={handleCloseDrawer}
                >
                  {t("Header.contact")}
                </Link>
              </li>
              <div className="flex flex-col items-center gap-6 flex-1 justify-center w-full">
                <span className=" text-lg font-bold">
                  {t("Header.followUs")}
                </span>
                <div className="flex gap-6">
                  <Link
                    href="https://www.facebook.com/share/18mtAGts1w/?mibextid=wwXIfr"
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
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
