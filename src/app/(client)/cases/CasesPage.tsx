"use client";

import Cases from "@/components/client/cases/Cases";
import FAQ from "@/components/client/solutions/FAQ";
import React from "react";
import { useTranslation } from "react-i18next";

const CasesPage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-5 sm:p-7 w-full h-full flex flex-col gap-10 md:gap-15 xl:gap-28 justify-center items-center relative my-20">
      <div className="max-w-xs md:max-w-[460px]">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center">
          {t("CasesPage.title")}
          <span className="text-primary"> {t("CasesPage.highlight")} </span>
        </h1>
      </div>
      <div className="flex-1 relative">
        <Cases />
      </div>
      <div className="flex-1 relative">
        <FAQ />
      </div>
    </div>
  );
};

export default CasesPage;
