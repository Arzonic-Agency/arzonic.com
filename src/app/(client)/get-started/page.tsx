"use client";

import React from "react";
import PriceEstimator from "@/components/client/get-started/PriceEstimator";
import { useRive } from "@rive-app/react-canvas";

const GetStarted = () => {
  const { RiveComponent } = useRive({
    src: "/rive/design.riv",
    autoplay: true,
  });

  return (
    <div className="py-20 md:py-0 md:min-h-screen flex items-center justify-center bg-base-100 flex-col md:flex-row">
      {/* LEFT: sliding form */}
      <div className="h-full md:w-1/2 p-8 ">
        <PriceEstimator />
      </div>

      {/* RIGHT: Rive animation */}
      <div className="hidden md:flex md:w-1/2 p-8 justify-center items-center">
        <RiveComponent className="w-full max-w-3xl h-[500px]" />
      </div>
    </div>
  );
};

export default GetStarted;
