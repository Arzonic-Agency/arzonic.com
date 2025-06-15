"use client";

import React from "react";
import { FaBuildingShield, FaGlobe, FaHeadset } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

const Support = () => {
  const { t } = useTranslation();

  return (
    <div className="card lg:card-side bg-base-100 shadow-sm gap-5 lg:gap-0 mt-10">
      <div className="flex p-2 items-start justify-start lg:items-center lg:justify-center gap-7 lg:gap-10 text-5xl lg:text-8xl lg:w-1/2">
        <div>
          <FaBuildingShield />
        </div>
        <div className="flex lg:flex-col justify-center items-center gap-7 lg:gap-14">
          <FaGlobe />
          <FaHeadset />
        </div>
      </div>

      <div className="card-body gap-7 p-2 lg:p-10">
        <h2 className="card-title text-2xl">{t("Support.title")}</h2>
        <ul className="flex flex-col gap-6">
          <li className="flex flex-col gap-1">
            <h3 className="text-base sm:text-lg font-semibold flex items-center gap-1">
              {t("Support.items.hosting.title")}
            </h3>
            <p className="text-zinc-400 text-sm md:w-4/5">
              {t("Support.items.hosting.desc")}
            </p>
          </li>
          <li className="flex flex-col gap-1">
            <h3 className="text-base sm:text-lg font-semibold flex items-center gap-1">
              {t("Support.items.security.title")}
            </h3>
            <p className="text-zinc-400 text-sm md:w-4/5">
              {t("Support.items.security.desc")}
            </p>
          </li>
          <li className="flex flex-col gap-1">
            <h3 className="text-base sm:text-lg font-semibold flex items-center gap-1">
              {t("Support.items.support.title")}
            </h3>
            <p className="text-zinc-400 text-sm md:w-4/5">
              {t("Support.items.support.desc")}
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Support;
