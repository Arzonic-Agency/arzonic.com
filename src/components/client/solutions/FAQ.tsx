import React from "react";
import { useTranslation } from "react-i18next";

const FAQ = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-full py-10">
      <div className="flex flex-col gap-10 sm:gap-16 md:gap-20 justify-center items-center h-full w-full">
        <h2 className="text-xl md:text-4xl md:font-semibold">
          {t("faq.title")}
        </h2>
        <div className="flex flex-col gap-4 md:gap-6 w-full justify-center items-center">
          <div className="collapse collapse-arrow shadow-sm max-w-[650px] w-full bg-base-200">
            <input type="radio" name="my-accordion-1" />
            <div className="collapse-title text-base md:text-lg font-semibold">
              {t("faq.q1.title")}
            </div>
            <div className="collapse-content">
              <p className="tracking-wide text-sm max-w-[88%]">
                {t("faq.q1.answer")}
              </p>
            </div>
          </div>
          <div className="collapse collapse-arrow shadow-sm max-w-[650px] w-full bg-base-200">
            <input type="radio" name="my-accordion-1" />
            <div className="collapse-title text-base md:text-lg font-semibold">
              {t("faq.q2.title")}
            </div>
            <div className="collapse-content">
              <p className="tracking-wide text-sm max-w-[88%]">
                {t("faq.q2.answer")}{" "}
              </p>
            </div>
          </div>
          <div className="collapse collapse-arrow shadow-sm max-w-[650px] w-full bg-base-200">
            <input type="radio" name="my-accordion-1" />
            <div className="collapse-title text-base md:text-lg  font-semibold">
              {t("faq.q3.title")}
            </div>
            <div className="collapse-content">
              <p className="tracking-wide text-sm max-w-[88%]">
                {t("faq.q3.answer")}
              </p>
            </div>
          </div>
          <div className="collapse collapse-arrow shadow-sm max-w-[650px] w-full bg-base-200">
            <input type="radio" name="my-accordion-1" />
            <div className="collapse-title text-base md:text-lg font-semibold">
              {t("faq.q4.title")}
            </div>
            <div className="collapse-content">
              <p className="tracking-wide font-medium text-sm max-w-[88%]">
                {t("faq.q4.answer")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
