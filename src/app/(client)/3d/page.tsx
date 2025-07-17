import React from "react";
import Spline from "@splinetool/react-spline";

const page = () => {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="max-w-[600px] h-[600px]">
        <Spline scene="https://prod.spline.design/7L07tDETuES9U9Si/scene.splinecode" />
      </div>
    </div>
  );
};

export default page;
