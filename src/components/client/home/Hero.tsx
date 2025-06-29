"use client";
import Image from "next/image";
import React from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import Link from "next/link";

const ThreeAnimation = dynamic(() => import("../../animation/threeAnimation"), {
  ssr: false,
});

const Hero = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="relative h-full w-full overflow-visible md:pl-4 lg:pl-8">
        <div className="relative z-10 flex items-center justify-center md:justify-between h-full px-6 pt-20 lg:pt-0">
          <div className="lg:w-[50%] flex flex-col gap-5 md:gap-7">
            <div className="flex gap-1 md:gap-3 items-center">
              <div className="flex relative w-10 h-6 md:w-14 md:h-9">
                <Image
                  src="/danmark.png"
                  alt={t("flags.danish", "Dansk flag")}
                  width={40}
                  height={24}
                  className="w-9 h-6 md:w-14 md:h-9 object-contain"
                  priority
                />
              </div>
              <h1 className="text-2xl md:text-4xl font-medium">
                {t("Hero.title")}
              </h1>
            </div>
            <div className="max-w-xl flex flex-col gap-3">
              <p className="text-sm sm:text-lg">{t("Hero.description")} </p>
            </div>
            <div className="flex gap-3 sm:items-center text-[11px] md:text-sm lg:text-base xl:text-lg  font-semibold tracking-wide">
              <Link
                href={"/solutions/web-applications"}
                className="badge badge-secondary badge-soft badge-xs md:badge-md lg:badge-lg"
                aria-label={t("aria.badges.webApplications")}
              >
                {t("Hero.webApplications")}
              </Link>
              <Link
                href={"/solutions/3d-visualization"}
                className="badge badge-secondary badge-soft badge-xs md:badge-md lg:badge-lg"
                aria-label={t("aria.badges.visualization")}
              >
                {t("Hero.visualization")}
              </Link>

              <Link
                href={"/solutions/custom-websites"}
                className="badge badge-secondary badge-soft badge-xs md:badge-md lg:badge-lg"
                aria-label={t("aria.badges.customWebsites")}
              >
                {t("Hero.customWebsites")}
              </Link>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <Link
                href="/solutions"
                className="btn btn-soft"
                aria-label={t("aria.navigation.seeMoreSolutions")}
              >
                {t("Hero.seeMore")}
              </Link>
              <Link
                href="/get-started"
                className="btn btn-primary md:hidden"
                aria-label={t("aria.navigation.getStarted")}
              >
                {t("Header.getStarted")}
              </Link>
            </div>
          </div>

          <div className="lg:w-[50%] h-full lg:block hidden">
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
