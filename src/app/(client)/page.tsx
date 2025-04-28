"use client";

import { useState } from "react";
import Hero from "@/components/client/home/Hero";
import Prices from "@/components/client/home/Prices";
import Process from "@/components/client/home/Process";
import NavProcess from "@/components/client/home/NavProcess";
import Preview from "@/components/client/home/Preview";
import SplashScreen from "@/components/client/layout/SplashScreen";

const Home = () => {
  const [isSticky, setIsSticky] = useState(false);

  return (
    <>
      <SplashScreen />
      <section className="h-[700px]">
        <Hero />
      </section>
      <section className="h-[2000px] lg:h-[800px]">
        <Prices />
      </section>
      <section className="h-full">
        {/* Send onStickyChange som prop */}
        <NavProcess onStickyChange={setIsSticky} />
      </section>
      <section id="Process" className="h-[2800px]">
        {/* Send isSticky som prop */}
        <Process isSticky={isSticky} />
      </section>
      <section className="h-[2000px]">
        <Preview />
      </section>
    </>
  );
};

export default Home;
