"use client";

import React, { useState } from "react";
import Setup from "./setup/Setup";
import Users from "./users/Users";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

const NavSettings = () => {
  const [activeTab, setActiveTab] = useState("setup");
  const { t } = useTranslation();
  return (
    <div className="w-full">
      <div
        role="tablist"
        className="tabs sm:tabs-lg w-full md:w-96 text-[15px]"
      >
        <button
          role="tab"
          className={`tab gap-2  ${
            activeTab === "setup"
              ? "tab-active bg-base-200 rounded-lg shadow-md"
              : ""
          }`}
          onClick={() => setActiveTab("setup")}
          aria-label={t("aria.nav_settings_setup_tab")}
        >
          <FaExternalLinkAlt />
          {t("layout_settings")}
        </button>
        <button
          role="tab"
          className={`tab gap-2  ${
            activeTab === "users"
              ? "tab-active bg-base-200 rounded-lg shadow-md"
              : ""
          }`}
          onClick={() => setActiveTab("users")}
          aria-label={t("aria.nav_settings_users_tab")}
        >
          <FaUsers />
          {t("user_control")}
        </button>
      </div>

      <div className="mt-3 md:mt-5">
        {activeTab === "setup" && (
          <div className="bg-base-200 rounded-lg shadow-md p-5 md:p-7">
            <Setup />
          </div>
        )}
        {activeTab === "users" && (
          <div className="bg-base-200 rounded-lg shadow-md p-5 md:p-7">
            <Users />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavSettings;
