"use client";

import React from "react";
import { FaCaretRight } from "react-icons/fa6";
import { useRive } from "@rive-app/react-canvas";

type ProcessProps = {
  isSticky: boolean;
};

const Process = ({ isSticky }: ProcessProps) => {
  const { RiveComponent } = useRive({
    src: "/rive/design.riv",
    autoplay: true,
  });

  return (
    <div className={`${isSticky ? "pt-[112px]" : ""}`}>
      <section id="discovery-strategy" className="h-[700px] w-full ">
        <div className="flex flex-col justify-center gap-5 h-full p-10 w-[55%]">
          <h3 className="text-lg tracking-widest text-secondary opacity-70">
            Discovery & Strategy
          </h3>
          <h4 className="text-4xl font-extralight">
            Understanding Your Vision
          </h4>
          <p>
            We start by truly understanding your business, your goals, and the
            people you want to reach. This gives us the right foundation for
            everything that follows.
          </p>
          <ul className="flex flex-col gap-4">
            <li className="flex gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" /> Deep dive into
              your goals and needs
            </li>
            <li className="flex gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" />
              Research of your market and target audience
            </li>
            <li className="flex gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" /> Strategic
              roadmap planning
            </li>
            <li className="flex gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" /> Clear project
              scope and timeline definition
            </li>
          </ul>
        </div>
      </section>
      <section
        id="design-experience"
        className="h-[700px] w-full flex justify-center"
      >
        {" "}
        <div className="flex flex-col justify-center gap-5 h-full p-10 w-[55%]">
          <h3 className="text-lg tracking-widest text-secondary opacity-70">
            Design & Experience
          </h3>
          <h4 className="text-4xl font-extralight">
            Crafting Engaging Experiences
          </h4>
          <p>
            We design intuitive and beautiful user experiences that not only
            look amazing but also guide your audience smoothly towards your
            goals.
          </p>
          <ul className="flex flex-col gap-4">
            <li className="flex gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" /> Wireframing
              and user journey mapping
            </li>
            <li className="flex gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" />
              Visual design focused on clarity and impact
            </li>
            <li className="flex gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" /> Responsive
              design for all devices
            </li>
            <li className="flex gap-2 items-center">
              <FaCaretRight className="text-secondary text-xl" /> User-centered
              experience optimization
            </li>
          </ul>
        </div>
        <div className="flex flex-col justify-center items-center gap-5 h-full p-10 w-[45%]">
          <div className="w-full h-full">
            {" "}
            <RiveComponent />
          </div>
        </div>
      </section>
      <section id="development-integration" className="h-[700px] w-full">
        {" "}
        <div className="flex flex-col justify-center gap-5 h-full p-10 w-[55%]">
          <h3 className="text-lg tracking-widest text-secondary opacity-70">
            Development & Integration
          </h3>
          <h4 className="text-4xl font-extralight">
            Building Solid Foundations
          </h4>
          <p>
            We turn designs into powerful, scalable, and future-proof digital
            solutions — ready to grow with your business needs.
          </p>
          <ul className="flex flex-col gap-4">
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
      </section>
      <section id="launch-support" className="h-[700px] w-full">
        {" "}
        <div className="flex flex-col justify-center gap-5 h-full p-10 w-[55%]">
          <h3 className="text-lg tracking-widest text-secondary opacity-70">
            Launch & Support
          </h3>
          <h4 className="text-4xl font-extralight">
            Bringing It to Life – and Beyond
          </h4>
          <p>
            Launching is just the beginning. We make sure your website goes live
            without a hitch – and we stay with you to ensure it continues to
            perform, evolve, and support your business goals.
          </p>
          <ul className="flex flex-col gap-4">
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
