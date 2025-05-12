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
      <section className="h-full md:h-[850px] mb-40 relative overflow-visible">
        <div className="absolute w-full h-full opacity-55">
          <Image
            src="/backgrounds/lines.svg"
            alt=""
            fill
            className="hidden md:block"
          />
          <Image
            src="/backgrounds/lines2.svg"
            alt=""
            fill
            className="block md:hidden "
          />
        </div>
        <Preview />
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
      <section className="h-full md:h-[850px] relative mb-16">
        <div className="absolute w-full h-full opacity-55">
          <Image
            src="/backgrounds/lines.svg"
            alt=""
            fill
            className="hidden md:block"
          />
          <Image
            src="/backgrounds/lines2.svg"
            alt=""
            fill
            className="block md:hidden "
          />
        </div>
        <CallToAction />
      </section>
    </>
  );
};

export default Home;
