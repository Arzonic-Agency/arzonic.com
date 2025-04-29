"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const steps = [
  "Discovery & Strategy",
  "Design & Experience",
  "Development & Integration",
  "Launch & Support",
];

type NavProcessProps = {
  onStickyChange?: (sticky: boolean) => void;
};

const NavProcess = ({ onStickyChange }: NavProcessProps) => {
  const navRef = useRef<HTMLDivElement | null>(null);
  const originalOffsetRef = useRef<number>(0);

  const [positionState, setPositionState] = useState<
    "normal" | "sticky" | "fixed"
  >("normal");
  const [fixedTop, setFixedTop] = useState<number>(0);

  const [progress, setProgress] = useState<number>(0);
  const [showNav, setShowNav] = useState<boolean>(true);
  const [activeStep, setActiveStep] = useState<number>(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (navRef.current && originalOffsetRef.current === 0) {
            originalOffsetRef.current =
              navRef.current.getBoundingClientRect().top + window.scrollY;
          }

          const currentScrollY = window.scrollY;
          const processSection = document.getElementById("Process");
          const navHeight = navRef.current?.offsetHeight || 102;

          if (processSection) {
            const processBottom =
              processSection.offsetTop + processSection.offsetHeight;

            if (currentScrollY < originalOffsetRef.current) {
              setPositionState("normal");
              setShowNav(true);
              onStickyChange?.(false);
            } else if (
              currentScrollY >= originalOffsetRef.current &&
              currentScrollY < processBottom - navHeight
            ) {
              if (positionState !== "sticky") {
                setPositionState("sticky");
                onStickyChange?.(true);
              }
              setShowNav(true);
            } else if (currentScrollY >= processBottom - navHeight) {
              if (positionState !== "fixed") {
                const navCurrentTop =
                  navRef.current.getBoundingClientRect().top + window.scrollY;
                setFixedTop(navCurrentTop);
                setPositionState("fixed");
                onStickyChange?.(false);
              }
              setShowNav(true);
            }
          }

          // Aktivt step
          const stepElements = [
            document.getElementById("discovery-strategy"),
            document.getElementById("design-experience"),
            document.getElementById("development-integration"),
            document.getElementById("launch-support"),
          ];

          let currentActiveStep = activeStep;

          stepElements.forEach((el, index) => {
            if (el) {
              const rect = el.getBoundingClientRect();
              const sectionHeight = rect.height || 700;
              const triggerPoint = sectionHeight * 0.6;

              if (rect.top <= triggerPoint && rect.bottom >= triggerPoint) {
                currentActiveStep = index;
              }
            }
          });

          setActiveStep(currentActiveStep);

          // Smooth progress bar
          if (processSection) {
            const { top, height } = processSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const scrollableHeight = height - windowHeight;
            const scrolled = -top;

            const startOffset = 10;
            const maxProgress = 100;
            const stepCount = steps.length;
            const stepHeight = scrollableHeight / stepCount;
            const correction = stepHeight * 0.5;

            const clampedScrolled = Math.max(
              0,
              Math.min(scrolled - correction, scrollableHeight)
            );

            const sectionProgress =
              scrollableHeight > 0
                ? startOffset +
                  (clampedScrolled / scrollableHeight) *
                    (maxProgress - startOffset)
                : startOffset;

            setProgress(
              Math.min(Math.max(sectionProgress, startOffset), maxProgress)
            );
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [positionState, activeStep, onStickyChange]);

  if (!showNav) return null;

  const getIdFromStep = (step: string) =>
    step.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-");

  const handleClick = (step: string) => {
    const id = getIdFromStep(step);
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col items-center justify-center gap-3">
        <h3 className="text-3xl font-bold">
          This is how our customer process looks like
        </h3>
        <p className="text-sm text-center mt-2">
          <u>We guide you</u> through every step with clarity, creativity, and
          care.
        </p>
      </div>

      {/* Sticky / Fixed Nav */}
      <div
        ref={navRef}
        className={`nav-process w-full ${
          positionState === "sticky"
            ? "sticky top-0 left-0 right-0 mx-auto"
            : ""
        } ${
          positionState === "fixed"
            ? "absolute left-1/2 transform -translate-x-1/2"
            : ""
        }`}
        style={positionState === "fixed" ? { top: `${fixedTop}px` } : {}}
      >
        <div className="nav-process-content">
          <div className="flex justify-center px-3 pb-5 pt-10 ">
            <ul className="flex gap-7 justify-evenly w-full">
              {steps.map((step, index) => (
                <li
                  key={index}
                  onClick={() => handleClick(step)}
                  className={`cursor-pointer font-semibold transition-all duration-300 xl:text-lg ${
                    activeStep === index
                      ? "text-secondary"
                      : "text-gray-500 hover:text-neutral-content"
                  }`}
                >
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {/* Progress bar */}
          <div className="progress-bar-container px-10">
            <motion.div
              className="progress-bar-fill"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.4 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavProcess;
