"use client";
import Image from "next/image";
import React from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

const ThreeAnimation = dynamic(() => import("../../animation/threeAnimation"), {
  ssr: false,
});

const Hero = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="relative h-full w-full overflow-visible md:pl-8 lg:pl-14">
        <div className="relative z-10 flex items-center justify-center md:justify-between h-full px-6 pt-20 lg:pt-0">
          <div className="lg:w-[50%] flex flex-col gap-7">
            <div className="flex gap-3 items-center">
              <div className="flex relative w-10 h-6 md:w-14 md:h-9 ">
                <Image
                  src="/danmark.png"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h1 className="text-2xl md:text-4xl">{t("Hero.title")}</h1>
            </div>
            <div className="max-w-xl flex flex-col gap-3">
              <p className="text-sm sm:text-base">{t("Hero.description")} </p>
              <span className="font-mono text-sm sm:text-base">
                {t("Hero.noTemplates")}
              </span>
            </div>
            <div className="flex gap-3 sm:items-center text-[11px] md:text-sm lg:text-base xl:text-lg  font-semibold tracking-wide">
              <span className="badge badge-primary badge-soft badge-xs md:badge-md">
                {t("Hero.customWebsites")}
              </span>

              <span className="badge badge-primary badge-soft badge-xs md:badge-md">
                {t("Hero.visualization")}
              </span>

              <span className="badge badge-primary badge-soft badge-xs md:badge-md">
                {t("Hero.webApplications")}
              </span>
            </div>
            <div className="mt-5">
              <button className="btn btn-secondary btn-outline">
                {t("Hero.seeMore")}
              </button>
            </div>
          </div>

          <div className="lg:w-[50%] h-full md:block hidden">
            <div className="w-full h-full relative bg-transparent ">
              <ThreeAnimation />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
