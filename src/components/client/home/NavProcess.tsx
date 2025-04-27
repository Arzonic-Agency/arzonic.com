"use client";

import { useEffect, useRef, useState } from "react";

const NavProcess = () => {
  const navRef = useRef<HTMLDivElement | null>(null);
  const originalOffsetRef = useRef<number>(0);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [showNav, setShowNav] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      // Record the original offset the first time we scroll.
      if (navRef.current && originalOffsetRef.current === 0) {
        originalOffsetRef.current =
          navRef.current.getBoundingClientRect().top + window.scrollY;
      }

      const currentScrollY = window.scrollY;
      const processSection = document.getElementById("Process");
      let processSectionBottom = 0;

      if (processSection) {
        processSectionBottom =
          processSection.offsetTop + processSection.offsetHeight;
      }

      // Show/hide/sticky logic
      if (currentScrollY < originalOffsetRef.current) {
        setIsSticky(false);
        setShowNav(true);
      } else if (
        currentScrollY >= originalOffsetRef.current &&
        currentScrollY <= processSectionBottom
      ) {
        setIsSticky(true);
        setShowNav(true);
      } else if (currentScrollY > processSectionBottom) {
        setShowNav(false);
      }

      // Progress bar calculation
      if (processSection) {
        const { top, height } = processSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollableHeight = height - windowHeight;
        const scrolled = -top;
        const clampedScrolled = Math.max(
          0,
          Math.min(scrolled, scrollableHeight)
        );
        const sectionProgress =
          scrollableHeight > 0 ? (clampedScrolled / scrollableHeight) * 100 : 0;
        setProgress(sectionProgress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!showNav) return null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center justify-center gap-3">
        <h3 className="text-3xl font-bold">
          This is how our customer process looks like
        </h3>
        <p className="text-sm text-center mt-2">
          <u>We guide you</u> through every step with clarity, creativity, and
          care.
        </p>
      </div>
      <div ref={navRef} className={`nav-process ${isSticky ? "sticky" : ""}`}>
        <div className="nav-process-content">
          <div className="flex justify-center p-10">
            <ul className="flex gap-2 justify-evenly w-full">
              <li className="">Discovery & Strategy</li>
              <li className="">Design & Experience</li>
              <li className="">Development & Integration</li>
              <li className="">Launch & Support</li>
            </ul>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavProcess;
