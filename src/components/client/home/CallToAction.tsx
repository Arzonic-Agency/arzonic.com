import React from "react";
import { useTranslation } from "react-i18next";
import OfferForm from "../forms/OfferForm";
import EuropeMap from "@/components/elements/EuropeMap";
import { FaPhone } from "react-icons/fa6";

const CallToAction = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-20 md:gap-30 xl:gap-28 lg:items-center  justify-center p-5">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 z-10">
        <div className="flex-initial lg:w-4/7 flex justify-center">
          <OfferForm />
        </div>
        <div className="flex-1 relative flex justify-center">
          <div className=" rounded-lg shadow-md p-5 flex flex-col gap-4 max-w-sm">
            <h3 className="text-xl font-bold">{t("ContactPage.readyTitle")}</h3>
            <p className="font-medium">{t("ContactPage.contactPrompt")}</p>
            <p>{t("ContactPage.ambitionMessage")}</p>
            <p className="font-medium flex items-center gap-2">
              {" "}
              <FaPhone size={15} /> {t("ContactPage.callPrompt")}
            </p>
            <a
              href="tel:+4522501703"
              className="flex items-center gap-2 text-secondary text-lg
               font-bold"
            >
              {t("ContactPage.phoneNumber")}
            </a>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-full gap-5 md:gap-7 lg:max-w-2xl">
        <EuropeMap />
        <div>
          <h4 className="text-lg text-zinc-400 ">
            {t("CallToAction.reachingBeyondBorders")}
          </h4>
          <p className="text-sm tracking-wide text-zinc-500 md:max-w-sm">
            {t("CallToAction.collaborationMessage")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
