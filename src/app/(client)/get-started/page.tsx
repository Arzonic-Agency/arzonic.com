"use client";

import React from "react";
import PriceEstimator from "@/components/client/get-started/PriceEstimator";
import { useRive } from "@rive-app/react-canvas";
import { useTranslation } from "react-i18next";

const GetStarted = () => {
  const { t } = useTranslation();
  const { RiveComponent } = useRive({
    src: "/rive/design.riv",
    autoplay: true,
  });

  return (
    <div className="py-20 md:py-0 md:min-h-screen flex items-center justify-center bg-base-100 flex-col ">
      <div className="max-w-md md:max-w-xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center">
          Estimate your project
          <span className="text-primary"> – in under a minute</span>
        </h1>
      </div>
      <div className="flex flex-col md:flex-row items-center">
        <div className="h-full md:w-1/2 p-8 ">
          <PriceEstimator />
        </div>

        <div className="hidden md:flex md:w-1/2 p-8 justify-center items-center">
          <RiveComponent className="w-full max-w-3xl h-[500px]" />
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
