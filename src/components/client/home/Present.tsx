import React from "react";

const Present = () => {
  return (
    <div className="flex items-center justify-center h-full w-full ">
      <div className="max-w-5xl flex flex-col gap-7">
        <h2 className="text-3xl font-light text-center z-20 m-7">
          Superfast websites – built fo﻿r performance and growth
        </h2>
        <div className="flex gap-7 relative">
          <div className="flex-3/5 rounded-xl bg-base-200 ring-2 ring-base-300 h-48 p-7 flex flex-col gap-3 shadow-lg electric-border border-present relative">
            <h3 className="text-xl font-bold shadow-xl">
              Custom design that reflects you
            </h3>
            <p className="w-4/5">
              No templates. No compromises. We design every pixel to match your
              brand and make you stand out.
            </p>
          </div>
          <div className="flex-2/5 rounded-xl bg-base-200 ring-2 ring-base-300 h-48 p-7 flex flex-col gap-3 shadow-lg">
            <h3 className="text-xl font-bold">Easy to manage</h3>
            <p>
              Update your content in seconds. Our built-in dashboard gives you
              full control
            </p>
          </div>
        </div>
        <div className="flex gap-7">
          <div className="flex-2/5 rounded-xl bg-base-200 ring-2 ring-base-300 h-48 p-7 flex flex-col gap-3 shadow-lg">
            <h3 className="text-xl font-bold">Blazing fast, everywhere</h3>
            <p>
              Your website is flexible, future-proof, and ready to scale with
              you.
            </p>
          </div>
          <div className="flex-3/5 rounded-xl bg-base-200 ring-2 ring-base-300 h-48 p-7 flex flex-col gap-3 shadow-lg electric-border border-present relative">
            <h3 className="text-xl font-bold shadow-xl">
              Built to grow with your business
            </h3>
            <p className="w-4/5">
              From small team to full-scale operation. Your website is flexible,
              future-proof, and ready to scale with you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Present;
