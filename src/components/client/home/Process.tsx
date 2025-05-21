"use client";

import React from "react";
import { FaCaretRight } from "react-icons/fa6";
import { useRive } from "@rive-app/react-canvas";
import { useTranslation } from "react-i18next";

type ProcessProps = {
  isSticky: boolean;
};

const Process = ({ isSticky }: ProcessProps) => {
  const { t } = useTranslation();

  const { RiveComponent: DesignRive } = useRive({
    src: "/rive/design.riv",
    autoplay: true,
  });

  const { RiveComponent: StrategyRive } = useRive({
    src: "/rive/strategy.riv",
    autoplay: true,
  });
  const { RiveComponent: CodingRive } = useRive({
    src: "/rive/coding.riv",
    autoplay: true,
  });
  const { RiveComponent: LaunchRive } = useRive({
    src: "/rive/launch.riv",
    autoplay: true,
  });

  return (
    <div className={`md:px-5 ${isSticky ? "pt-[118px] md:pt-[112px]" : ""}`}>
      <section
        id="discovery-strategy"
        className="md:h-[650px] h-[750px] w-full flex flex-col md:flex-row justify-center"
      >
        <div className="flex flex-col justify-center gap-5 md:h-full px-5 py-10  md:p-10 md:w-[55%]">
          <h3 className="text-sm md:text-lg tracking-widest text-secondary opacity-85">
            {t("Process.discoveryStrategy.title")}
          </h3>
          <h4 className="text-2xl md:text-4xl font-extralight">
            {t("Process.discoveryStrategy.subtitle")}
          </h4>
          <p className="tracking-[0.022em] text-sm md:text-base w-4/5 md:w-full">
            {t("Process.discoveryStrategy.description")}
          </p>
          <ul className="flex flex-col gap-4 text-sm md:text-base ">
            <li className="flex gap-1 md:gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" />{" "}
              {t("Process.discoveryStrategy.steps.0")}
            </li>
            <li className="flex gap-1 md:gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" />{" "}
              {t("Process.discoveryStrategy.steps.1")}
            </li>
            <li className="flex gap-1 md:gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" />{" "}
              {t("Process.discoveryStrategy.steps.2")}
            </li>
            <li className="flex gap-1 md:gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" />{" "}
              {t("Process.discoveryStrategy.steps.3")}
            </li>
          </ul>
        </div>
        <div className="flex flex-col justify-start md:justify-center items-start md:items-center gap-5 h-full px-10 md:p-10 md:w-[45%]">
          <div className="md:w-full w-60 h-full max-h-60 md:max-h-96">
            <StrategyRive />
          </div>
        </div>
      </section>
      <section
        id="design-experience"
        className="md:h-[650px] h-[750px] w-full flex flex-col md:flex-row justify-center"
      >
        <div className="flex flex-col justify-center gap-5  md:h-full p-5 md:p-10 md:w-[55%]">
          <h3 className="text-sm md:text-lg tracking-widest text-secondary opacity-85">
            {t("Process.designExperience.title")}
          </h3>
          <h4 className="text-2xl md:text-4xl font-extralight">
            {t("Process.designExperience.subtitle")}
          </h4>
          <p className="tracking-[0.022em] text-sm md:text-base w-4/5 md:w-full">
            {t("Process.designExperience.description")}
          </p>
          <ul className="flex flex-col gap-4 text-sm md:text-base">
            <li className="flex gap-1 md:gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" />{" "}
              {t("Process.designExperience.steps.0")}
            </li>
            <li className="flex gap-1 md:gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" />{" "}
              {t("Process.designExperience.steps.1")}
            </li>
            <li className="flex gap-1 md:gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" />{" "}
              {t("Process.designExperience.steps.2")}
            </li>
            <li className="flex gap-1 md:gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" />{" "}
              {t("Process.designExperience.steps.3")}
            </li>
          </ul>
        </div>
        <div className="flex flex-col justify-start md:justify-center items-start md:items-center gap-5 h-full px-10 md:p-10 md:w-[45%]">
          <div className="md:w-full w-60 h-full max-h-64 md:max-h-96">
            <DesignRive />
          </div>
        </div>
      </section>
      <section
        id="development-integration"
        className="md:h-[650px] h-[750px] w-full flex flex-col md:flex-row justify-center"
      >
        <div className="flex flex-col justify-center gap-5  md:h-full p-5 md:p-10 md:w-[55%]">
          <h3 className="text-sm md:text-lg tracking-widest text-secondary opacity-85">
            {t("Process.developmentIntegration.title")}
          </h3>
          <h4 className="text-2xl md:text-4xl font-extralight">
            {t("Process.developmentIntegration.subtitle")}
          </h4>
          <p className="tracking-[0.022em] text-sm md:text-base w-4/5 md:w-full">
            {t("Process.developmentIntegration.description")}
          </p>
          <ul className="flex flex-col gap-4 text-sm md:text-base">
            <li className="flex gap-1 md:gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" />{" "}
              {t("Process.developmentIntegration.steps.0")}
            </li>
            <li className="flex gap-1 md:gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" />{" "}
              {t("Process.developmentIntegration.steps.1")}
            </li>
            <li className="flex gap-1 md:gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" />{" "}
              {t("Process.developmentIntegration.steps.2")}
            </li>
            <li className="flex gap-1 md:gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" />{" "}
              {t("Process.developmentIntegration.steps.3")}
            </li>
          </ul>
        </div>
        <div className="flex flex-col justify-start md:justify-center items-start md:items-center gap-5 h-full px-10 md:p-10 md:w-[45%]">
          <div className="md:w-full w-60 h-full max-h-64 md:max-h-80">
            <CodingRive />
          </div>
        </div>
      </section>
      <section
        id="launch-support"
        className="md:h-[650px] h-[750px] w-full  flex-col md:flex-row"
      >
        <div className="flex flex-col justify-center gap-5  md:h-full p-5 md:p-10 md:w-[55%]">
          <h3 className="text-sm md:text-lg tracking-widest text-secondary opacity-85">
            {t("Process.launchSupport.title")}
          </h3>
          <h4 className="text-xl md:text-4xl font-extralight">
            {t("Process.launchSupport.subtitle")}
          </h4>
          <p className="tracking-[0.022em] text-sm md:text-base w-4/5 md:w-full">
            {t("Process.launchSupport.description")}
          </p>
          <ul className="flex flex-col gap-4 text-sm md:text-base pt-3">
            <li className="flex gap-1 md:gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" />{" "}
              {t("Process.launchSupport.steps.0")}
            </li>
            <li className="flex gap-1 md:gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" />{" "}
              {t("Process.launchSupport.steps.1")}
            </li>
            <li className="flex gap-1 md:gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" />{" "}
              {t("Process.launchSupport.steps.2")}
            </li>
            <li className="flex gap-1 md:gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" />{" "}
              {t("Process.launchSupport.steps.3")}
            </li>
          </ul>
        </div>
        <div className="flex flex-col justify-start md:justify-center items-start md:items-center gap-5 h-full px-10 md:p-10 md:w-[45%]">
          <div className="md:w-full w-60 h-full max-h-64 md:max-h-96">
            <LaunchRive />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Process;
