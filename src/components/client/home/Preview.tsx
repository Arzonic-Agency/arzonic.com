import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

const Preview = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-5 items-center justify-center h-full w-full relative overflow-hidden">
      <div className="flex flex-col items-center gap-3">
        <h3 className="text-2xl md:text-3xl text-primary font-light">
          {t("Preview.title")}
        </h3>
        <span className="tracking-wide text-xs md:text-base">
          {t("Preview.subtitle")}
        </span>
      </div>
      <div className="z-10 max-w-4xl max-h-4xl flex items-center justify-center overflow-hidden">
        <Image
          src="/backgrounds/mockup-preview.png"
          alt=""
          width={1000}
          height={500}
        />
      </div>
    </div>
  );
};

export default Preview;
