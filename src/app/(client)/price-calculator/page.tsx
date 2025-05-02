import PriceEstimator from "@/components/client/price-calculator/PriceEstimator";
import React from "react";

const PriceCalculator = () => {
  return (
    <main className="min-h-screen bg-base-100 py-12 px-4 md:px-7 ">
      <PriceEstimator />
    </main>
  );
};

export default PriceCalculator;
