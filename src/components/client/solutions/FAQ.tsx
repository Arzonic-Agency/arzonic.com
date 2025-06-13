"use client";

import React from "react";
import { useTranslation } from "react-i18next";

const FAQ = () => {
  const { t } = useTranslation();
  const translate = (key: string) => t(`FAQ.${key}`);
  const translateAria = (key: string) =>
    t(`aria.FAQ.${key}`, { defaultValue: `Expand FAQ question ${key}` });

  return (
    <div className="w-full h-full py-10">
      <div className="flex flex-col gap-10 sm:gap-16 justify-center items-center h-full w-full">
        <h2 className="text-xl sm:text-xl md:text-3xl font-light">
          {translate("title")}
        </h2>
        <div className="flex flex-col gap-4 md:gap-6 w-full h-[400px] justify-start items-center">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className="collapse collapse-arrow shadow-sm max-w-[650px] w-full bg-base-200"
            >
              <input
                type="radio"
                name="faq-accordion"
                aria-label={translateAria(`q${num}`)}
              />
              <div className="collapse-title text-base md:text-lg font-medium">
                {translate(`q${num}.title`)}
              </div>
              <div className="collapse-content">
                <p className="tracking-wide text-sm max-w-[88%]">
                  {translate(`q${num}.answer`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
