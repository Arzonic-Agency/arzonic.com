// arzonic/src/app/(client)/price-calculator/page.tsx
'use client';

import React from 'react';
import PriceEstimator from '@/components/client/price-calculator/PriceEstimator';
import { useRive } from "@rive-app/react-canvas";

export default function PriceCalculatorPage() {
  const { RiveComponent } = useRive({
    src: '/rive/design.riv',
    autoplay: true,
  });

  return (
    <main className="min-h-screen flex items-center bg-base-100">
      {/* LEFT: sliding form */}
      <div className="w-1/2 p-8">
        <PriceEstimator />
      </div>

      {/* RIGHT: Rive animation */}
      <div className="w-1/2 p-8 flex justify-center items-center">
        <RiveComponent className="w-full max-w-3xl h-[500px]" />
      </div>
    </main>
  );
}
