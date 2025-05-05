"use client";
import Image from "next/image";
import React from "react";
import dynamic from "next/dynamic";

const ThreeAnimation = dynamic(() => import("../../animation/threeAnimation"), {
  ssr: false,
});

const Hero = () => {
  return (
    <>
      <div className="relative h-full w-full overflow-visible md:pl-7 ">
        <div className="relative z-10 flex lg:flex-row flex-col items-center justify-center md:justify-between h-full px-6">
          <div className="lg:w-[50%] flex flex-col gap-5">
            <div className="flex gap-3 items-center">
              <div className="flex relative w-8 h-6 md:w-12 md:h-10 ">
                <Image src="/danmark.png" alt="" fill />
              </div>
              <h1 className="text-2xl md:text-4xl">MODERN WEB AGENCY</h1>
            </div>
            <div>
              <p className="text-sm sm:text-base ">
                We specialize in building high-performance websites and
                immersive 3D experiences using modern, custom-built technology —
                no templates, no WordPress.
              </p>
            </div>
            <div className="flex gap-2 items-center text-sm sm:text-lg ">
              <span>Custom Websites</span>
              &#10140;
              <span>3D Design</span>
              &#10140;
              <span>Web Applications</span>
            </div>
            <div className="mt-5">
              <button className="btn btn-outline text-base-content">
                See More
              </button>
            </div>
          </div>

          <div className="lg:w-[50%] h-full md:block hidden">
            <div className="w-full h-full relative bg-transparent">
              <ThreeAnimation />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
