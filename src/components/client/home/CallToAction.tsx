import React from "react";
import { useTranslation } from "react-i18next";
import { FaPhone } from "react-icons/fa6";
import OfferForm from "../forms/OfferForm";
import Image from "next/image";
import EuropeMap from "./elements/EuropeMap";

const CallToAction = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-20 md:gap-30 xl:gap-28 justify-center items-center relative my-20">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        <div className="flex-initial lg:w-3/5 flex justify-center">
          <OfferForm />
        </div>
        <div className="flex-1 lg:w-2/5 relative">
          <div className="bg-base-100 rounded-lg shadow-md p-8 md:p-10 flex flex-col gap-5 max-w-md">
            <h3 className="text-xl font-bold">{t("ContactPage.readyTitle")}</h3>
            <p className="font-medium">{t("ContactPage.contactPrompt")}</p>
            <p>{t("ContactPage.ambitionMessage")}</p>
            <p className="font-medium">{t("ContactPage.callPrompt")}</p>
            <a
              href="tel:+4526181201"
              className="flex items-center gap-2 text-secondary text-xl font-bold"
            >
              <FaPhone /> {t("ContactPage.phoneNumber")}
            </a>
          </div>
          <Image
            src="/elements/rocket.png"
            alt={t("ContactPage.imageAlt")}
            width={200}
            height={200}
            className="w-28 h-auto absolute rotate-45 bottom-10 right-32 hidden lg:block"
          />
        </div>
      </div>
      <div className="flex items-center flex-col gap-7 ">
        <EuropeMap />
        <h1 className="text-xl md:text-3xl">Vi rækker længere end grænserne</h1>
        <p>
          Hos Arzonic samarbejder vi med ambitiøse virksomheder i hele Europa.{" "}
          <br />
          Uanset hvor du er, står vi klar til at løfte din digitale
          tilstedeværelse!
        </p>
      </div>
    </div>
  );
};

export default CallToAction;
