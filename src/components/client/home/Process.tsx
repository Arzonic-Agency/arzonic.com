import React from "react";
import { FaCaretRight } from "react-icons/fa6";

type ProcessProps = {
  isSticky: boolean;
};

const Process = ({ isSticky }: ProcessProps) => {
  return (
    <div className={`${isSticky ? "pt-[110px]" : ""}`}>
      <section id="discovery-strategy" className="h-[700px] w-full ">
        <div className="flex flex-col justify-center gap-5 h-full p-10 w-[70%]">
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
      <section id="design-experience" className="h-[700px] w-full">
        {" "}
        <div className="flex flex-col justify-center gap-5 h-full p-10 w-[70%]">
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
      </section>
      <section id="development-integration" className="h-[700px] w-full">
        {" "}
        <div className="flex flex-col justify-center gap-5 h-full p-10 w-[70%]">
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
      <section
        id="launch-support"
        className="h-[700px] w-full flex items-center justify-center"
      >
        <div className="h-80 w-80">
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{ width: "100%", height: "auto" }}
          >
            <source src="/test.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>
    </div>
  );
};

export default Process;
