"use client";

import React, { useState } from "react";
import Setup from "./setup/Setup";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaFileZipper } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import Docs from "./docs/Docs";

const NavSettings = () => {
  const [activeTab, setActiveTab] = useState("docs");
  const { t } = useTranslation();
  return (
    <div className="w-full">
      <div role="tablist" className="tabs sm:tabs-lg w-full text-[15px]">
        <button
          role="tab"
          className={`tab gap-2  ${
            activeTab === "docs"
              ? "tab-active bg-base-200 rounded-lg shadow-md"
              : ""
          }`}
          onClick={() => setActiveTab("docs")}
          aria-label={t("aria.nav_settings_docs_tab")}
        >
          <FaFileZipper />
          {t("docs_settings")}
        </button>
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
      </div>
      <div className="mt-3 gap-3">
        {activeTab === "docs" && (
          <div className="">
            <Docs />
          </div>
        )}
        {activeTab === "setup" && (
          <div className="">
            <Setup />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavSettings;
