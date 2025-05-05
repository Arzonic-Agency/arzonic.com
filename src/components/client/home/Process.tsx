"use client";

import React from "react";
import { FaCaretRight } from "react-icons/fa6";
import { useRive } from "@rive-app/react-canvas";

type ProcessProps = {
  isSticky: boolean;
};

const Process = ({ isSticky }: ProcessProps) => {
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

  return (
    <div className={`${isSticky ? "pt-[112px]" : ""}`}>
      <section
        id="discovery-strategy"
        className="h-[700px] w-full flex flex-col md:flex-row justify-center"
      >
        <div className="flex flex-col justify-center gap-5 h-full p-5 md:p-10 md:w-[55%]">
          <h3 className="text-lg tracking-widest text-secondary opacity-70">
            Discovery & Strategy
          </h3>
          <h4 className="text-xl md:text-4xl font-extralight">
            From Vision to Roadmap
          </h4>
          <p className="tracking-[0.022em] text-sm md:text-base">
            Just like any great expedition, your project begins with a clear
            destination and a solid route. We explore your goals, understand
            your market, and build a step-by-step plan to reach your digital
            summit.
          </p>
          <ul className="flex flex-col gap-4 text-sm md:text-base">
            <li className="flex gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" /> Clarify your
              destination (vision & purpose)
            </li>
            <li className="flex gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" />
              Understand your audience and terrain
            </li>
            <li className="flex gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" /> Create a
              strategic map with key checkpoints
            </li>
            <li className="flex gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" /> Set clear
              scope and timeframes for the journey
            </li>
          </ul>
        </div>
        <div className="flex flex-col justify-center items-center gap-5 h-full p-10 md:w-[45%]">
          <div className="w-full h-full max-h-96">
            <StrategyRive />
          </div>
        </div>
      </section>
      <section
        id="design-experience"
        className="h-[700px] w-full flex flex-col md:flex-row justify-center"
      >
        {" "}
        <div className="flex flex-col justify-center gap-5 h-full p-5 md:p-10 md:w-[55%]">
          <h3 className="text-lg tracking-widest text-secondary opacity-70">
            Design & Experience
          </h3>
          <h4 className="text-xl md:text-4xl font-extralight">
            Shaping the Experience
          </h4>
          <p className="tracking-[0.022em] text-sm md:text-base">
            With the journey mapped, we bring it to life. Starting with
            wireframes, we layer in clarity, emotion, and interaction—designing
            every screen to feel effortless and aligned with your goals.
          </p>
          <ul className="flex flex-col gap-4 text-sm md:text-base">
            <li className="flex gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" /> Map the user
              journey with intent
            </li>
            <li className="flex gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" />
              Transform ideas into structured wireframes
            </li>
            <li className="flex gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" /> Design
              responsive layouts across all devices
            </li>
            <li className="flex gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" /> Focus
              relentlessly on user needs and simplicity
            </li>
          </ul>
        </div>
        <div className="flex flex-col justify-center items-center gap-5 h-full p-10 md:w-[45%]">
          <div className="w-full h-full max-h-[420px]">
            {" "}
            <DesignRive />
          </div>
        </div>
      </section>
      <section
        id="development-integration"
        className="h-[700px] w-full flex flex-col md:flex-row justify-center"
      >
        {" "}
        <div className="flex flex-col justify-center gap-5 h-full p-5 md:p-10 md:w-[55%]">
          <h3 className="text-lg tracking-widest text-secondary opacity-70">
            Development & Integration
          </h3>
          <h4 className="text-xl md:text-4xl font-extralight">
            Building Solid Foundations
          </h4>
          <p className="tracking-[0.022em] text-sm md:text-base">
            We turn designs into powerful, scalable, and future-proof digital
            solutions — ready to grow with your business needs.
          </p>
          <ul className="flex flex-col gap-4 text-sm md:text-base">
            <li className="flex gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" /> Frontend and
              backend development
            </li>
            <li className="flex gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" />
              Clean, scalable, and efficient code
            </li>
            <li className="flex gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" /> API and
              third-party system integrations
            </li>
            <li className="flex gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" /> Ongoing
              testing for quality assurance
            </li>
          </ul>
        </div>
        <div className="flex flex-col justify-center items-center gap-5 h-full p-5 md:p-10 md:w-[45%]">
          <div className="w-full h-full max-h-[420px]">
            {" "}
            <CodingRive />
          </div>
        </div>
      </section>
      <section
        id="launch-support"
        className="h-[700px] w-full flex-col md:flex-row"
      >
        {" "}
        <div className="flex flex-col justify-center gap-5 h-full p-5 md:p-10 md:w-[55%]">
          <h3 className="text-lg tracking-widest text-secondary opacity-70">
            Launch & Support
          </h3>
          <h4 className="text-xl md:text-4xl font-extralight">
            Bringing It to Life – and Beyond
          </h4>
          <p className="tracking-[0.022em] text-sm md:text-base">
            Launching is just the beginning. We make sure your website goes live
            without a hitch – and we stay with you to ensure it continues to
            perform, evolve, and support your business goals.
          </p>
          <ul className="flex flex-col gap-4 text-sm md:text-base">
            <li className="flex gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" /> Smooth and
              secure go-live process
            </li>
            <li className="flex gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" />
              Continuous support and updates
            </li>
            <li className="flex gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" /> Performance
              tracking and improvements
            </li>
            <li className="flex gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" /> Scalable
              solutions for future needs
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Process;
