"use client";

import Prices from "@/components/client/pricing/Plans";
import PricingComparison from "@/components/client/pricing/PlansComparison";
import Support from "@/components/client/pricing/Support";
import React from "react";
import { useTranslation } from "react-i18next";

const PricingPage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-5 sm:p-7 w-full h-full flex flex-col gap-12 md:gap-20 xl:gap-32 justify-center items-center my-20 ">
      <div className="max-w-[300px] md:max-w-[480px]">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center">
          {t("PricingPage.titleStart")}
          <span className="text-primary"> {t("PricingPage.titleEnd")} </span>
        </h1>
      </div>
      <div className="flex flex-col justify-center gap-15 md:gap-20 xl:gap-28 mt-10 max-w-6xl w-full">
        <Prices />

        <PricingComparison />
        <Support />
      </div>
    </div>
  );
};

export default PricingPage;
