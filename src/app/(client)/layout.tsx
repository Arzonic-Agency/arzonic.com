"use client";

import Header from "@/components/client/layout/Header";
import { FaAngleUp } from "react-icons/fa6";
import { useEffect, useState } from "react";
import Footer from "@/components/client/layout/Footer";
import Script from "next/script";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Script
        async
        defer
        src="https://stats.arzonic.com/script.js"
        data-website-id="3226dc67-1feb-4d8c-9f6d-75f7dd0d23d7"
      />
      <div className="sm:h-lvh h-dvh max-w-screen-2xl mx-auto pt-[64px] md:pt-[101px] ">
        <header>
          <Header />
        </header>
        <main>{children}</main>
        <footer>
          <Footer />
        </footer>
        {showScroll && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-9 right-8 p-2 bg-base-100 ring-2 ring-secondary text-secondary rounded-lg shadow-lg z-50  cursor-pointer block md:hidden"
          >
            <FaAngleUp size={17} />
          </button>
        )}
      </div>
    </>
  );
}
