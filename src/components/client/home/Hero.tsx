"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { motion } from "framer-motion";

const Hero = () => {
  const { t } = useTranslation();

  const [isFirstImage, setIsFirstImage] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFirstImage((prev) => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="relative h-full w-full overflow-visible md:pl-4 lg:pl-8">
        <div className="relative z-10 flex  items-center justify-center md:justify-between h-full px-6 pt-20 lg:pt-0">
          <div className="flex-2/3 flex flex-col gap-5 md:gap-7">
            <div className="flex sm:gap-1 md:gap-3 items-center">
              <div className="flex relative w-10 h-6 md:w-14 md:h-9">
                <Image
                  src="/danmark.png"
                  alt={t("flags.danish", "Dansk flag")}
                  width={50}
                  height={40}
                  className="w-7 sm:w-9 h-auto md:w-14 md:h-auto object-contain"
                  priority
                />
              </div>
              <h1 className="text-base md:text-2xl  font-medium tracking-wide">
                {t("Hero.title")}
              </h1>
            </div>
            <div className=" flex flex-col gap-3 max-w-[340px] sm:max-w-[425px] md:max-w-[690px] lg:max-w-[530px] xl:max-w-[700px]">
              <p className="text-2xl sm:text-3xl md:text-5xl lg:text-4xl xl:text-5xl md:font-light ">
                {t("Hero.description")}{" "}
              </p>
            </div>
            <div className="flex gap-3 sm:items-center    font-semibold tracking-wide">
              <Link
                href={"/solutions/web-applications"}
                className="badge badge-secondary badge-soft badge-sm lg:badge-md xl:badge-lg"
                aria-label={t("aria.badges.webApplications")}
              >
                {t("Hero.webApplications")}
              </Link>
              <Link
                href={"/solutions/3d-visualization"}
                className="badge badge-secondary badge-soft badge-sm lg:badge-md xl:badge-lg"
                aria-label={t("aria.badges.visualization")}
              >
                {t("Hero.visualization")}
              </Link>

              <Link
                href={"/solutions/systems-integrations"}
                className="badge badge-secondary badge-soft badge-sm lg:badge-md xl:badge-lg"
                aria-label={t("aria.badges.systemsIntegrations")}
              >
                {t("Hero.systemsIntegrations")}
              </Link>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <Link
                href="/solutions"
                className="btn btn-soft "
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

          <div className="flex-1/3 h-full lg:flex hidden items-center justify-center relative">
            <motion.div
              animate={{ y: [0, -30, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="mockup-phone scale-55 lg:scale-60"
            >
              <div className="mockup-phone-camera"></div>
              <div className="mockup-phone-display text-white grid place-content-center">
                <Image
                  alt="wallpaper"
                  src={
                    isFirstImage
                      ? "/models/mobile-screen-l.png"
                      : "/models/mobile-screen-d.png"
                  }
                  width={400}
                  height={800}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </motion.div>
            <div className="absolute bottom-45 right-10 lg:flex hidden flex-col p-4 justify-center items-start gap-2 bg-base-200 ring-1 ring-base-300 w-60 h-auto rounded-xl">
              <div className="flex items-center justify-center gap-2">
                <Image
                  src="/customer/favicon1.png"
                  alt={t("Hero.imageAlt")}
                  width={200}
                  height={200}
                  className="w-5"
                />
                <span className="text-xs font-semibold pt-1">hhservice.dk</span>
                <div className="rating rating-xs">
                  <div className="mask mask-star" aria-label="1 star"></div>
                  <div className="mask mask-star" aria-label="2 star"></div>
                  <div className="mask mask-star " aria-label="3 star"></div>
                  <div className="mask mask-star " aria-label="4 star"></div>
                  <div
                    className="mask mask-star "
                    aria-label="5 star"
                    aria-current="true"
                  ></div>
                </div>
              </div>
              <div>
                <p className="textarea-xs">{t("Hero.customerFeedback")}</p>
              </div>
            </div>
            {/* <div className="w-full h-full relative bg-transparent ">
              <MobileAnimation />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
