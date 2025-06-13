"use client";

import OfferForm from "@/components/client/forms/OfferForm";
import Image from "next/image";
import React from "react";
import { FaPhone } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-5 sm:p-7 w-full h-full flex flex-col gap-10 md:gap-15 xl:gap-28 justify-center items-center relative my-20">
      <div className="max-w-md md:max-w-xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center">
          {t("ContactPage.title")}{" "}
          <span className="text-primary">{t("ContactPage.subtitle")}</span>
        </h1>
      </div>
      <motion.div
        className="flex flex-col lg:flex-row gap-10 lg:gap-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex-initial lg:w-3/5 flex justify-center">
          <OfferForm />
        </div>
        <div className="flex-1 lg:w-2/5 relative">
          <motion.div
            className="bg-base-100 rounded-lg shadow-md p-8 md:p-10 flex flex-col gap-5 max-w-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h3 className="text-xl font-bold">{t("ContactPage.readyTitle")}</h3>
            <p className="font-medium">{t("ContactPage.contactPrompt")}</p>
            <p>{t("ContactPage.ambitionMessage")}</p>
            <p className="font-medium">{t("ContactPage.callPrompt")}</p>
            <a
              href="tel:+4522501703"
              className="flex items-center gap-2 text-secondary text-xl font-bold"
            >
              <FaPhone /> {t("ContactPage.phoneNumber")}
            </a>
          </motion.div>
          <Image
            src="/elements/rocket.png"
            alt={t("ContactPage.imageAlt")}
            width={200}
            height={200}
            className="w-28 h-auto absolute rotate-45 bottom-10 right-32 hidden lg:block"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;
