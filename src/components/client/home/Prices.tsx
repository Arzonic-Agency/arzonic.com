import Link from "next/link";
import React from "react";
import { FaCheck } from "react-icons/fa6";

const Prices = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full ">
      <div className="flex flex-col lg:flex-row items-center justify-evenly gap-4 w-full h-full">
        <div className="flex flex-col justify-between shadow-lg rounded-xl w-80 h-[500px] p-10  shadow-zinc-800">
          <div className="flex flex-col gap-5">
            <h3 className="text-2xl font-bold">Starter Site</h3>
            <p className="text-sm">
              Perfect for small businesses or personal brands
            </p>
          </div>
          <ul className="flex flex-col gap-4">
            <li className="flex gap-2 items-center">
              <span className="text-primary">
                <FaCheck size={20} />
              </span>
              <span className="text-sm font-semibold">Custom Design</span>
            </li>
            <li className="flex gap-2 items-center">
              <span className="text-primary">
                <FaCheck size={20} />
              </span>
              <span className="text-sm font-semibold">Responsive and fast</span>
            </li>
            <li className="flex gap-2 items-center">
              <span className="text-primary">
                <FaCheck size={20} />
              </span>
              <span className="text-sm font-semibold">Basic SEO setup</span>
            </li>
            <li className="flex gap-2 items-center">
              <span className="text-primary">
                <FaCheck size={20} />
              </span>
              <span className="text-sm font-semibold">
                Simple CMS or static content
              </span>
            </li>
          </ul>
          <div className="flex gap-5 items-end">
            <span>Starting from</span>
            <span className="text-3xl font-semibold tracking-wide">€950</span>
          </div>
        </div>
        <div className="flex flex-col justify-between shadow-lg rounded-xl w-80 h-[500px] p-10  border-primary border-b-5 shadow-zinc-800">
          <div className="flex flex-col gap-5">
            <h3 className="text-2xl font-bold">Web Application</h3>
            <p className="text-sm">
              Tailored for digital products and custom functionality
            </p>
          </div>
          <div>
            <ul className="flex flex-col gap-4">
              <li className="flex gap-2 items-center">
                <span className="text-primary">
                  <FaCheck size={20} />
                </span>
                <span className="text-sm font-semibold">
                  Bespoke UI/UX design
                </span>
              </li>
              <li className="flex gap-2 items-center">
                <span className="text-primary">
                  <FaCheck size={20} />
                </span>
                <span className="text-sm font-semibold">
                  Feature-rich functionality
                </span>
              </li>
              <li className="flex gap-2 items-center">
                <span className="text-primary">
                  <FaCheck size={20} />
                </span>
                <span className="text-sm font-semibold">
                  Database integration
                </span>
              </li>
              <li className="flex gap-2 items-center">
                <span className="text-primary">
                  <FaCheck size={20} />
                </span>
                <span className="text-sm font-semibold"> Admin dashboard </span>
              </li>
            </ul>
          </div>
          <div className="flex gap-5 items-end">
            <span>Starting from</span>
            <span className="text-3xl font-semibold tracking-wide">€1,750</span>
          </div>
        </div>
        <div className="flex flex-col justify-between shadow-lg shadow-zinc-800 rounded-xl w-80 h-[500px] p-10">
          <div className="flex flex-col gap-5">
            <h3 className="text-2xl font-bold">3D Premium</h3>
            <p className="text-sm">
              Perfect for small businesses or personal brands
            </p>
          </div>
          <div>
            <ul className="flex flex-col gap-4">
              <li className="flex gap-2 items-center">
                <span className="text-primary">
                  <FaCheck size={20} />
                </span>
                <span className="text-sm font-semibold">Custom Design</span>
              </li>
              <li className="flex gap-2 items-center">
                <span className="text-primary">
                  <FaCheck size={20} />
                </span>
                <span className="text-sm font-semibold">
                  Responsive and fast
                </span>
              </li>
              <li className="flex gap-2 items-center">
                <span className="text-primary">
                  <FaCheck size={20} />
                </span>
                <span className="text-sm font-semibold">Basic SEO setup</span>
              </li>
              <li className="flex gap-2 items-center">
                <span className="text-primary">
                  <FaCheck size={20} />
                </span>
                <span className="text-sm font-semibold">
                  Simple CMS or static content
                </span>
              </li>
            </ul>
          </div>
          <div className="flex gap-5 items-end">
            <span>Starting from</span>
            <span className="text-3xl font-semibold tracking-wide">€2,150</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-5">
        <h3 className="text-lg">Get your custom quote in few seconds</h3>
        <Link href="/price-calculator" className="btn btn-primary">
          Get a Quote
        </Link>
      </div>
    </div>
  );
};

export default Prices;
