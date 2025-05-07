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
      <div className="relative h-full w-full overflow-visible md:pl-7 ">
        <div className="relative z-10 flex items-center justify-center md:justify-between h-full px-6 pt-20 lg:pt-0">
          <div className="lg:w-[50%] flex flex-col gap-7">
            <div className="flex gap-3 items-center">
              <div className="flex relative w-10 h-6 md:w-14 md:h-9 ">
                <Image src="/danmark.png" alt="" fill />
              </div>
              <h1 className="text-2xl md:text-4xl">{t("Hero.title")}</h1>
            </div>
            <div className="max-w-2xl">
              <p className="text-sm sm:text-base">
                {t("Hero.description")}{" "}
                <span className="font-mono">{t("Hero.noTemplates")}</span>
              </p>
            </div>
            <div className="flex gap-3 sm:items-center text-[11px] md:text-sm lg:text-base xl:text-xl  font-semibold tracking-wide">
              <span>{t("Hero.customWebsites")}</span>
              <span className="text-secondary hidden sm:block">&#10140;</span>
              <span>{t("Hero.visualization")}</span>
              <span className="text-secondary hidden sm:block">&#10140;</span>
              <span>{t("Hero.webApplications")}</span>
            </div>
            <div className="mt-5">
              <button className="btn btn-primary btn-outline text-base-content">
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
