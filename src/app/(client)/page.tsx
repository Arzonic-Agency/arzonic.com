"use client";

import { useState } from "react";
import Hero from "@/components/client/home/Hero";
import Prices from "@/components/client/home/Prices";
import Process from "@/components/client/home/Process";
import NavProcess from "@/components/client/home/NavProcess";
import Preview from "@/components/client/home/Preview";
import SplashScreen from "@/components/client/layout/SplashScreen";
import Present from "@/components/client/home/Present";
import CallToAction from "@/components/client/home/CallToAction";
import Image from "next/image";

const Home = () => {
  const [isSticky, setIsSticky] = useState(false);

  return (
    <>
      <SplashScreen />
      <section className="h-96 md:h-[700px] relative md:static">
        <div className="background-animation-layer" />
        <div className="background-fade-bottom" />
        <Hero />
      </section>
      <section className="h-[1000px] md:h-[800px]">
        <Present />
      </section>
      <section className="relative h-full md:h-[850px] 2xl:h-[1100px] mb-40 overflow-visible xl:grid xl:place-items-center">
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
        <div className="relative z-10 w-full max-w-screen-xl px-6">
          <Preview />
        </div>
      </section>
      <section className="h-full">
        <NavProcess onStickyChange={setIsSticky} />
      </section>
      <section className="h-[3000px] md:h-[2600px]" id="Process">
        <Process isSticky={isSticky} />
      </section>
      <section className=" lg:h-[850px] my-40 hidden lg:block">
        <Prices />
      </section>
      <section className="relative h-full md:h-[850px] xl:h-[900px] 2xl:h-[1100px] mb-16 overflow-visible xl:grid xl:place-items-center">
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

export default Home;
