"use client";

import { useState } from "react";
import Hero from "@/components/client/home/Hero";
import Prices from "@/components/client/home/Prices";
import Process from "@/components/client/home/Process";
import NavProcess from "@/components/client/home/NavProcess";
import Preview from "@/components/client/home/Preview";
import SplashScreen from "@/components/client/layout/SplashScreen";
import Present from "@/components/client/home/Present";

const Home = () => {
  const [isSticky, setIsSticky] = useState(false);

  return (
    <>
      <SplashScreen />
      <section className="h-96 md:h-[700px]">
        <div className="background-animation-layer " />
        <div className="background-fade-bottom" />

        <Hero />
      </section>
      <section className="h-[2000px] lg:h-[700px] z-10 mb-40">
        <Present />
      </section>
      <section className="h-full">
        {/* Send onStickyChange som prop */}
        <NavProcess onStickyChange={setIsSticky} />
      </section>
      <section id="Process" className="h-[2800px]">
        {/* Send isSticky som prop */}

        <Process isSticky={isSticky} />
      </section>
      <section className="h-[2000px] lg:h-[750px]">
        <Prices />
      </section>
      <section className="h-[2000px]">
        <Preview />
      </section>
    </>
  );
};

export default Home;
