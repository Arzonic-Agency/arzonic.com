"use client";

import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

const Preview = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-5 items-center justify-center h-full w-full relative overflow-hidden px-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <h3 className="text-2xl md:text-4xl font-extralight">
          {t("Preview.title")}
        </h3>
        <span className="tracking-wide text-xs md:text-base">
          {t("Preview.subtitle")}
        </span>
      </div>
      <div className="relative w-full max-w-[900px] mx-auto rounded-2xl overflow-hidden">
        <Image
          src="/backgrounds/mockup-preview.png"
          alt={t("Preview.aria.imageAlt")}
          aria-label={t("Preview.aria.imageAlt")}
          width={1200}
          height={1000}
          className="w-full h-auto rounded-2xl shadow-md mx-auto"
          quality={75}
          priority
        />
      </div>
    </div>
  );
};

export default Preview;
