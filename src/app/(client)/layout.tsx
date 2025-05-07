"use client";

import Header from "@/components/client/layout/Header";
import { FaAngleUp } from "react-icons/fa6";
import { useEffect, useState } from "react";
import Footer from "@/components/client/layout/Footer";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
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
            className="fixed bottom-10 right-10 p-2 bg-base-100 ring-2 ring-secondary text-secondary rounded-lg shadow-lg z-50 block cursor-pointer"
          >
            <FaAngleUp size={17} />
          </button>
        )}
      </div>
    </>
  );
}
