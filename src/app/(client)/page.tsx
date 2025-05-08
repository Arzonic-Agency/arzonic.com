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

const Home = () => {
  const [isSticky, setIsSticky] = useState(false);

  return (
    <>
      <SplashScreen />
      <section className="h-96 md:h-[700px] relative md:static">
        <div className="background-animation-layer " />
        <div className="background-fade-bottom" />
        <Hero />
      </section>
      <section className="h-[1000px] md:h-[800px]">
        <Present />
      </section>
      <section className="h-[2000px] lg:h-[800px] mb-40">
        <Prices />
      </section>
      <section className="h-full">
        <NavProcess onStickyChange={setIsSticky} />
      </section>
      <section id="Process" className="h-[2800px]">
        <Process isSticky={isSticky} />
      </section>
      <section className="h-[1000px]">
        <Preview />
      </section>
      <section className="h-full">
        <CallToAction />
      </section>
    </>
  );
};

export default Home;
