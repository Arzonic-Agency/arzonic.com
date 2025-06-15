"use client";

import React, { useEffect, useState } from "react";
import { FaCheck, FaPlus } from "react-icons/fa6";
import { motion } from "framer-motion";
import { getPackages } from "@/lib/client/actions";
import { useTranslation } from "react-i18next";

interface Package {
  label: string;
  price_eur: number;
  price_dkk: number;
  month_eur?: number;
  month_dkk?: number;
}

interface PlansProps {
  pricingType: "oneTime" | "monthly";
  setPricingType: React.Dispatch<React.SetStateAction<"oneTime" | "monthly">>;
}

const Plans = ({ pricingType, setPricingType }: PlansProps) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const tStarter = (key: string) => t(`Starter.${key}`);
  const tPro = (key: string) => t(`Pro.${key}`);
  const tPremium = (key: string) => t(`Premium.${key}`);

  const [packages, setPackages] = useState<Record<string, Package>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPackages();

        const keyToLabel: Record<string, string> = {
          Starter: "Starter",
          Pro: "Pro",
          Premium: "Premium",
        };

        const map: Record<string, Package> = {};
        data.forEach((p) => {
          const match = Object.entries(keyToLabel).find(
            ([, lab]) => lab === p.label
          );
          if (match) {
            map[match[0]] = p;
          }
        });

        setPackages(map);
      } catch (error) {
        console.error("Failed loading prices:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const getPrice = (key: string) => {
    if (loading) return "…";
    const pkg = packages[key];
    if (!pkg) return t("PricingPage.startingFrom") + "…";

    const isDanish = locale.startsWith("da");
    const currency = isDanish ? "DKK" : "EUR";

    const value =
      pricingType === "monthly"
        ? isDanish
          ? pkg.month_dkk
          : pkg.month_eur
        : isDanish
        ? pkg.price_dkk
        : pkg.price_eur;

    if (value == null) return "–";

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getTabLabel = () =>
    pricingType === "monthly"
      ? t("PricingPage.monthly48")
      : t("PricingPage.oneTime");

  const planCards = [
    {
      key: "Starter",
      title: tStarter("title"),
      desc: tStarter("description"),
      features: ["customDesign", "responsiveFast", "basicSEO", "simpleCMS"],
      tFeature: tStarter,
    },
    {
      key: "Pro",
      title: tPro("title"),
      desc: tPro("description"),
      features: [
        <span
          key="base"
          className="text-xs font-semibold text-secondary flex items-center gap-1"
        >
          <FaPlus size={12} /> {tStarter("title")} {tPro("including")}
        </span>,
        "bespokeUIUX",
        "featureRich",
        "databaseIntegration",
        "adminDashboard",
      ],
      tFeature: tPro,
    },
    {
      key: "Premium",
      title: tPremium("title"),
      desc: tPremium("description"),
      features: [
        <span
          key="base"
          className="text-xs font-semibold text-secondary flex items-center gap-1"
        >
          <FaPlus size={12} /> {tPro("title")} {tPremium("including")}
        </span>,
        "sleekLayout",
        "parallaxEffects",
        "integrated3D",
        "performance",
      ],
      tFeature: tPremium,
    },
  ].map(({ key, title, desc, features, tFeature }) => (
    <div key={key} className="relative" aria-label={title}>
      <div className="flex flex-col justify-between shadow-lg  w-70 sm:w-80 h-[460px] sm:h-[500px] p-7 md:p-8 rounded-xl bg-base-200 ring-2 shadow-base-300 ring-base-300">
        <div className="flex flex-col gap-5">
          <h3 className="text-3xl font-bold tracking-wide">{title}</h3>
          <p className="text-sm sm:text-base">{desc}</p>
        </div>
        <ul className="flex flex-col gap-4">
          {features.map((f, idx) =>
            typeof f === "string" ? (
              <li key={f} className="flex gap-2 items-center">
                <FaCheck className="text-primary" size={20} />
                <span className="text-xs sm:text-sm font-semibold">
                  {tFeature(`features.${f}`)}
                </span>
              </li>
            ) : (
              <li key={idx} className="flex gap-2 items-center">
                {f}
              </li>
            )
          )}
        </ul>
        <div className="flex flex-col gap-1 items-start mt-2">
          <span className="text-xs text-zinc-500">{getTabLabel()}</span>
          <span className="text-3xl font-semibold tracking-wide">
            {getPrice(key)}
          </span>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="flex flex-col gap-10 items-center justify-center w-full relative">
      {/* Titel og undertekst */}
      <div className="flex flex-col items-center gap-5">
        <span className="text-xl sm:text-xl md:text-2xl font-light text-center">
          {t("PricingPage.subtitle")}
        </span>
      </div>

      {/* Tab knapper */}
      <div className="flex gap-3 bg-base-200 p-1 rounded-xl shadow-sm">
        <button
          onClick={() => setPricingType("oneTime")}
          className={`px-4 py-1 rounded-lg text-sm font-medium transition ${
            pricingType === "oneTime"
              ? "bg-primary text-white "
              : "bg-transparent text-primary"
          }`}
        >
          {t("PricingPage.oneTimeTab")}
        </button>
        <button
          onClick={() => setPricingType("monthly")}
          className={`px-4 py-1 rounded-lg text-sm font-medium transition ${
            pricingType === "monthly"
              ? "bg-primary text-white"
              : "bg-transparent text-primary"
          }`}
        >
          {t("PricingPage.monthlyTab")}
        </button>
      </div>

      {/* Desktop grid visning */}
      <motion.div
        className="hidden lg:flex flex-row items-center justify-between w-full h-full z-10 gap-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {planCards}
      </motion.div>

      {/* Mobil carousel visning */}
      <div className="carousel carousel-center w-full gap-5 lg:hidden">
        {planCards.map((card, index) => (
          <div key={index} className="carousel-item p-2">
            <div className="w-full flex justify-center">{card}</div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="text-xs text-zinc-500 text-center max-w-md">
        {t("PricingPage.vatNote")}
        <br />
        {t("PricingPage.paymentInfo")}
      </div>
    </div>
  );
};

export default Plans;
