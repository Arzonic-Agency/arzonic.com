import Link from "next/link";
import React from "react";
import { FaCheck, FaPlus } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

const Prices = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-full w-full ">
      <div className="flex flex-col lg:flex-row items-center justify-evenly gap-4 w-full h-full ">
        <div className="relative">
          <div className="flex flex-col justify-between shadow-lg rounded-xl w-80 h-[500px] p-10  shadow-zinc-800 bg-base-100 border-zinc-400 border-b-5">
            <div className="flex flex-col gap-5">
              <h3 className="text-2xl font-bold">{t("StarterSite.title")}</h3>
              <p className="text-sm">{t("StarterSite.description")}</p>
            </div>
            <ul className="flex flex-col gap-4">
              <li className="flex gap-2 items-center">
                <span className="text-primary">
                  <FaCheck size={20} />
                </span>
                <span className="text-sm font-semibold">
                  {t("StarterSite.features.customDesign")}
                </span>
              </li>
              <li className="flex gap-2 items-center">
                <span className="text-primary">
                  <FaCheck size={20} />
                </span>
                <span className="text-sm font-semibold">
                  {t("StarterSite.features.responsiveFast")}
                </span>
              </li>
              <li className="flex gap-2 items-center">
                <span className="text-primary">
                  <FaCheck size={20} />
                </span>
                <span className="text-sm font-semibold">
                  {t("StarterSite.features.basicSEO")}
                </span>
              </li>
              <li className="flex gap-2 items-center">
                <span className="text-primary">
                  <FaCheck size={20} />
                </span>
                <span className="text-sm font-semibold">
                  {t("StarterSite.features.simpleCMS")}
                </span>
              </li>
            </ul>
            <div className="flex gap-5 items-end">
              <span>{t("startingFrom")}</span>
              <span className="text-3xl font-semibold tracking-wide">€950</span>
            </div>
          </div>
          <div className="absolute left-0 bottom-0 w-[320px] rounded-2xl flash h-8 -z-10" />
        </div>
        <div className="relative">
          <div className="flex flex-col justify-between shadow-lg rounded-xl w-80 h-[500px] p-10  border-primary border-b-5 shadow-zinc-800 z-10 bg-base-100">
            <div className="flex flex-col gap-5">
              <h3 className="text-2xl font-bold">
                {t("WebApplication.title")}
              </h3>
              <p className="text-sm">{t("WebApplication.description")}</p>
            </div>
            <div>
              <ul className="flex flex-col gap-4">
                <li className="flex gap-2 items-center">
                  <span className="text-primary">
                    <FaPlus size={15} className="text-primary" />
                  </span>
                  <span className="text-xs font-semibold text-secondary">
                    {t("StarterSite.title")}
                  </span>
                </li>
                <li className="flex gap-2 items-center">
                  <span className="text-primary">
                    <FaCheck size={20} />
                  </span>
                  <span className="text-sm font-semibold">
                    {t("WebApplication.features.bespokeUIUX")}
                  </span>
                </li>
                <li className="flex gap-2 items-center">
                  <span className="text-primary">
                    <FaCheck size={20} />
                  </span>
                  <span className="text-sm font-semibold">
                    {t("WebApplication.features.featureRich")}
                  </span>
                </li>
                <li className="flex gap-2 items-center">
                  <span className="text-primary">
                    <FaCheck size={20} />
                  </span>
                  <span className="text-sm font-semibold">
                    {t("WebApplication.features.databaseIntegration")}
                  </span>
                </li>
                <li className="flex gap-2 items-center">
                  <span className="text-primary">
                    <FaCheck size={20} />
                  </span>
                  <span className="text-sm font-semibold">
                    {t("WebApplication.features.adminDashboard")}
                  </span>
                </li>
              </ul>
            </div>
            <div className="flex gap-5 items-end">
              <span>{t("startingFrom")}</span>
              <span className="text-3xl font-semibold tracking-wide">
                €1,750
              </span>
            </div>
          </div>
          <div className="absolute left-0 bottom-0 bg-primary w-80 rounded-xl flash-popular h-4 -z-10" />
        </div>
        <div className="relative">
          <div className="flex flex-col justify-between shadow-lg shadow-zinc-800 border-zinc-400 border-b-5 rounded-xl w-80 h-[500px] p-10 bg-base-100">
            <div className="flex flex-col gap-5">
              <h3 className="text-2xl font-bold">{t("3DPremium.title")}</h3>
              <p className="text-sm">{t("3DPremium.description")}</p>
            </div>
            <div>
              <ul className="flex flex-col gap-4">
                <li className="flex gap-2 items-center">
                  <span className="text-primary">
                    <FaPlus size={15} className="text-primary" />
                  </span>
                  <span className="text-xs font-semibold text-secondary">
                    {t("WebApplication.title")}
                  </span>
                </li>
                <li className="flex gap-2 items-center">
                  <span className="text-primary">
                    <FaCheck size={20} />
                  </span>
                  <span className="text-sm font-semibold">
                    {t("3DPremium.features.sleekLayout")}
                  </span>
                </li>
                <li className="flex gap-2 items-center">
                  <span className="text-primary">
                    <FaCheck size={20} />
                  </span>
                  <span className="text-sm font-semibold">
                    {t("3DPremium.features.parallaxEffects")}
                  </span>
                </li>
                <li className="flex gap-2 items-center">
                  <span className="text-primary">
                    <FaCheck size={20} />
                  </span>
                  <span className="text-sm font-semibold">
                    {t("3DPremium.features.integrated3D")}
                  </span>
                </li>
                <li className="flex gap-2 items-center">
                  <span className="text-primary">
                    <FaCheck size={20} />
                  </span>
                  <span className="text-sm font-semibold">
                    {t("3DPremium.features.performance")}
                  </span>
                </li>
              </ul>
            </div>
            <div className="flex gap-5 items-end">
              <span>{t("startingFrom")}</span>
              <span className="text-3xl font-semibold tracking-wide">
                €2,150
              </span>
            </div>
          </div>
          <div className="absolute left-0 bottom-0  w-[320px] rounded-2xl flash h-8 -z-10" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-5">
        <h3 className="text-lg">{t("customQuotePrompt")}</h3>
        <Link href="/price-calculator" className="btn btn-primary">
          {t("getQuote")}
        </Link>
      </div>
    </div>
  );
};

export default Prices;
