"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaBrush, FaCode, FaMap, FaRocket } from "react-icons/fa6";
import type { ReactElement } from "react";

interface Step {
  id: string;
  label: string;
  icon: ReactElement;
}

const NavProcess = ({
  onStickyChange,
}: {
  onStickyChange?: (sticky: boolean) => void;
}) => {
  const { t } = useTranslation();

  const steps: Step[] = useMemo(
    () => [
      {
        id: "discovery-strategy",
        label: t("NavProcess.steps.discoveryStrategy"),
        icon: <FaMap />,
      },
      {
        id: "design-experience",
        label: t("NavProcess.steps.designExperience"),
        icon: <FaBrush />,
      },
      {
        id: "development-integration",
        label: t("NavProcess.steps.developmentIntegration"),
        icon: <FaCode />,
      },
      {
        id: "launch-support",
        label: t("NavProcess.steps.launchSupport"),
        icon: <FaRocket />,
      },
    ],
    [t]
  );

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
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportMid = window.innerHeight / 2;
      const proc = document.getElementById("Process");
      const navHeight = navRef.current?.offsetHeight ?? 0;

      if (proc && navRef.current) {
        const top = proc.offsetTop;
        const bottom = top + proc.offsetHeight;
        if (scrollY < originalOffsetRef.current) {
          if (positionState !== "normal") {
            setPositionState("normal");
            onStickyChange?.(false);
          }
        } else if (scrollY < bottom - navHeight) {
          if (positionState !== "sticky") {
            setPositionState("sticky");
            onStickyChange?.(true);
          }
        } else {
          if (positionState !== "fixed") {
            const navAbs =
              navRef.current.getBoundingClientRect().top + window.scrollY;
            setFixedTop(navAbs);
            setPositionState("fixed");
            onStickyChange?.(false);
          }
        }
        setShowNav(true);
      }

      let newActive = activeStep;
      steps.forEach((step, idx) => {
        const el = document.getElementById(step.id);
        if (!el) return;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= viewportMid && bottom >= viewportMid) newActive = idx;
      });
      if (newActive !== activeStep) setActiveStep(newActive);
      if (proc) {
        const activationYs = steps.map((step) => {
          const el = document.getElementById(step.id)!;
          const rect = el.getBoundingClientRect();
          const docTop = window.scrollY + rect.top;
          return docTop - viewportMid;
        });

        const procRect = proc.getBoundingClientRect();
        const procDocTop = window.scrollY + procRect.top;
        activationYs.push(procDocTop + procRect.height - viewportMid);

        const segments = activationYs.length - 1;
        let newProgress = 0;

        if (scrollY < activationYs[0]) {
          newProgress = 0;
        } else if (scrollY >= activationYs[segments]) {
          newProgress = 100;
        } else {
          let i = 0;
          for (; i < segments; i++) {
            if (scrollY >= activationYs[i] && scrollY < activationYs[i + 1])
              break;
          }
          const startY = activationYs[i];
          const endY = activationYs[i + 1];
          const within = (scrollY - startY) / (endY - startY);
          newProgress = ((i + within) / segments) * 100;
        }

        if (Math.abs(newProgress - progress) > 0.5) {
          setProgress(newProgress);
        }
      }
    };

    const handleResize = () => {
      if (navRef.current) {
        originalOffsetRef.current =
          navRef.current.getBoundingClientRect().top + window.scrollY;
      }
      handleScroll();
    };

    // Initial måling + første kald
    if (navRef.current && originalOffsetRef.current === 0) {
      originalOffsetRef.current =
        navRef.current.getBoundingClientRect().top + window.scrollY;
    }
    setTimeout(handleScroll, 0);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeStep, positionState, progress, onStickyChange, steps]);

  if (!showNav) return null;

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const offset = window.innerWidth < 768 ? 100 : 0;
    const top = element.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-5 ">
      {/* Header */}
      <div className="flex flex-col items-center justify-center gap-3">
        <h3 className="text-base md:text-4xl font-bold md:font-extralight">
          {t("NavProcess.header.title")}
        </h3>
        <p className="text-sm md:text-lg text-center mt-2 p-5 max-w-xs md:max-w-2xl tracking-wider hidden md:block">
          <span className="md:underline-offset-3 md:decoration-secondary md:decoration-2 md:underline">
            {t("NavProcess.header.description-first")}{" "}
          </span>
          {t("NavProcess.header.description-second")}
        </p>
      </div>

      {/* Nav */}
      <div
        ref={navRef}
        className={`
          nav-process w-full max-w-7xl bg-base-100 z-10
          ${
            positionState === "sticky"
              ? "sticky top-0 left-0 right-0 mx-auto shadow-md"
              : ""
          }
          ${
            positionState === "fixed"
              ? "absolute left-1/2 transform -translate-x-1/2"
              : ""
          }
        `}
        style={positionState === "fixed" ? { top: `${fixedTop}px` } : {}}
      >
        <div className="nav-process-content px-5 md:px-10">
          <div className="flex justify-center pb-5 pt-10">
            <ul className="flex gap-7 justify-evenly w-full">
              {steps.map((step, idx) => {
                const isActive = activeStep === idx;
                const colorClass = isActive
                  ? "text-secondary"
                  : "text-gray-500 hover:text-neutral-content";
                return (
                  <li
                    key={step.id}
                    onClick={() => handleClick(step.id)}
                    className="cursor-pointer font-normal transition-all duration-200 text-xs md:text-base xl:text-lg flex flex-col items-center"
                    aria-label={t(`NavProcess.aria.${step.id}`)}
                  >
                    <span className={`block md:hidden text-2xl ${colorClass}`}>
                      {step.icon}
                    </span>
                    <span className={`hidden md:block ${colorClass}`}>
                      {step.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="progress-bar-container">
            <motion.div
              className="progress-bar-fill"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavProcess;
