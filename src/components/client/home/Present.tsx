import React from "react";
import { FaArrowUpRightDots, FaPalette } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

const Present = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center h-full w-full p-3">
      <div className="max-w-5xl flex flex-col gap-7 ">
        <h2 className="text-xl sm:text-xl md:text-3xl font-light text-center z-20 mb-10  max-w-xs sm:max-w-full mx-auto">
          {t("Present.title")}
        </h2>
        <div className="flex gap-7 relative md:flex-row flex-col-reverse">
          <div className="flex-3/5 rounded-xl bg-base-200 ring-2 ring-base-300 h-48 p-7 flex flex-col gap-3 shadow-lg relative">
            <h3 className="text-lg md:text-2xl font-bold shadow-xl">
              {t("Present.customDesign.title")}
            </h3>
            <p className="text-sm md:text-base  w-4/5 text-zinc-400 font-light">
              {t("Present.customDesign.description")}
            </p>
            <div className="absolute bottom-4 right-4 text-secondary">
              <FaPalette className="text-4xl md:text-5xl" />
            </div>
          </div>
          <div className="flex-2/5 rounded-xl bg-base-200 ring-2 ring-base-300 h-48 p-7 flex flex-col gap-3 shadow-lg bg-two">
            <h3 className="text-lg md:text-2xl font-bold">
              {t("Present.easyToManage.title")}
            </h3>
            <p className="text-sm md:text-base text-zinc-400 font-light">
              {t("Present.easyToManage.description")}
            </p>
          </div>
        </div>
        <div className="flex gap-7 md:flex-row flex-col">
          <div className="flex-2/5 rounded-xl bg-base-200 ring-2 ring-base-300 h-48 p-7 flex flex-col gap-3 shadow-lg bg-one">
            <h3 className="text-lg md:text-2xl font-bold">
              {t("Present.blazingFast.title")}
            </h3>
            <p className="text-sm md:text-base text-zinc-400 font-light">
              {t("Present.blazingFast.description")}
            </p>
          </div>
          <div className="flex-3/5 rounded-xl bg-base-200 ring-2 ring-base-300 h-48 p-7 flex flex-col gap-3 shadow-lg electric-border border-present relative">
            <h3 className="text-lg md:text-2xl font-bold shadow-xl">
              {t("Present.builtToGrow.title")}
            </h3>
            <p className="text-sm md:text-base w-6/7 md:w-4/5 text-zinc-400 font-light">
              {t("Present.builtToGrow.description")}
            </p>
            <div className="absolute bottom-4 right-4 text-secondary">
              <FaArrowUpRightDots className="text-4xl md:text-5xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Present;
