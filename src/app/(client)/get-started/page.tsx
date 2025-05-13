"use client";

import React from "react";
import PriceEstimator from "@/components/client/get-started/PriceEstimator";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { motion } from "framer-motion";

const GetStarted = () => {
  const { t } = useTranslation();

  return (
    <div className="p-7 w-full h-full flex flex-col gap-10 md:gap-15 xl:gap-28 justify-center items-center relative my-20">
      <div className="max-w-xs sm:max-w-md md:max-w-lg">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-start sm:text-center">
          {t("GetStarted.title")}
          <span className="text-primary"> {t("GetStarted.subtitle")} </span>
        </h1>
      </div>

      <motion.div
        className="flex flex-col gap-7 md:flex-row justify-center items-center z-10 relative md:max-w-4xl lg:max-w-6xl h-[850px]  md:h-[450px]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="h-full md:w-1/2">
          <PriceEstimator />
        </div>
        <div className="flex md:w-1/2 h-full justify-center items-center relative">
          <Image
            src="/backgrounds/mockup-preview.png"
            alt=""
            width={1000}
            height={1000}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default GetStarted;
