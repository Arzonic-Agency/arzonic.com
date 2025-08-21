"use client";

import { useState } from "react";
import Hero from "@/components/client/home/Hero";
import Process from "@/components/client/home/Process";
import NavProcess from "@/components/client/home/NavProcess";
import Preview from "@/components/client/home/Preview";
// import SplashScreen from "@/components/client/layout/SplashScreen";
import Present from "@/components/client/home/Present";
import CallToAction from "@/components/client/home/CallToAction";
import Image from "next/image";

const HomePage = () => {
  const [isSticky, setIsSticky] = useState(false);

  return (
    <>
      {/* <SplashScreen /> */}
      <section className="h-full lg:h-[700px] static">
        <div className="background-animation-layer-left" />
        <div className="background-fade-bottom" />
        <Hero />
      </section>
      <section className="h-[700px] md:h-[800px]">
        <Present />
      </section>
      <section className="relative h-full md:h-[800px] xl:h-[900px] mb-30 overflow-visible flex items-center">
        <div className="absolute xl:left-1/2 xl:-translate-x-1/2 xl:w-screen w-full h-full">
          <div className="background-fade-top " />
          <div className="background-animation-layer-right" />
          <div className="background-fade-bottom hidden  lg:block" />
        </div>
        <div className="relative z-10 w-full max-w-screen-xl px-6 ">
          <Preview />
        </div>
      </section>
      <section className="h-full">
        <NavProcess onStickyChange={setIsSticky} />
      </section>
      <section className="h-[3000px] md:h-[2600px]" id="Process">
        <Process isSticky={isSticky} />
      </section>
      <section className="relative h-full lg:h-[850px] xl:h-[900px] 2xl:h-[1100px] mb-16 overflow-visible xl:grid xl:place-items-center mt-16">
        <div className="absolute xl:left-1/2 xl:-translate-x-1/2 xl:top-0 xl:w-screen w-full h-full opacity-55 z-0">
          <Image
            src="/backgrounds/lines.svg"
            alt=""
            fill
            className="hidden md:block object-cover"
          />
          <Image
            src="/backgrounds/lines2.svg"
            alt=""
            fill
            className="block md:hidden object-cover"
          />
        </div>
        <div className="relative z-10 w-full max-w-screen-xl">
          <CallToAction />
        </div>
      </section>
    </>
  );
};

export default HomePage;
