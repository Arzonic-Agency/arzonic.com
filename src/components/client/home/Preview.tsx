"use client";

import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

const Preview = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-5 items-center justify-center h-full w-full relative overflow-hidden px-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <h3 className="text-2xl md:text-3xl text-primary font-light">
          {t("Preview.title")}
        </h3>
        <span className="tracking-wide text-xs md:text-base text-neutral-600 dark:text-neutral-300">
          {t("Preview.subtitle")}
        </span>
      </div>
      <div className="relative w-full max-w-[900px] aspect-video mx-auto rounded-2xl overflow-hidden">
        <Image
          src="/backgrounds/mockup-preview.png"
          alt="Eksempel på løsning"
          width={900}
          height={506} // 16:9
          className="w-full max-w-[900px] h-auto rounded-2xl shadow-md mx-auto"
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 85vw, 900px"
          quality={75}
          priority
        />
      </div>
    </div>
  );
};

export default Preview;
