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
}

const Plans = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const tStart = (key: string) => t(`StarterSite.${key}`);
  const tApp = (key: string) => t(`WebApplication.${key}`);
  const t3D = (key: string) => t(`3DPremium.${key}`);

  const [packages, setPackages] = useState<Record<string, Package>>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"oneTime" | "monthly">("oneTime");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPackages();

        const keyToLabel: Record<string, string> = {
          StarterSite: "Starter Site",
          WebApplication: "Web Application",
          "3DPremium": "3D Premium",
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
    const value = isDanish ? pkg.price_dkk : pkg.price_eur;
    const currency = isDanish ? "DKK" : "EUR";

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getTabLabel = () => {
    return tab === "oneTime"
      ? t("PricingPage.oneTime")
      : t("PricingPage.monthlyIncl");
  };

  return (
    <div className="flex flex-col gap-10 items-center justify-center w-full relative">
      {/* Title & subtitle */}
      <div className="flex flex-col items-center gap-5">
        <span className="text-xl sm:text-xl md:text-2xl font-light text-center">
          {t("PricingPage.subtitle")}
        </span>
      </div>

      {/* Tab buttons */}
      <div className="flex gap-3 bg-base-200 p-1 rounded-xl shadow-sm">
        <button
          onClick={() => setTab("oneTime")}
          className={`px-4 py-1 rounded-lg text-sm font-medium transition ${
            tab === "oneTime"
              ? "bg-primary text-white"
              : "bg-transparent text-primary"
          }`}
        >
          {t("PricingPage.oneTimeTab")}
        </button>
        <button
          onClick={() => setTab("monthly")}
          className={`px-4 py-1 rounded-lg text-sm font-medium transition ${
            tab === "monthly"
              ? "bg-primary text-white"
              : "bg-transparent text-primary"
          }`}
        >
          {t("PricingPage.monthlyTab")}
        </button>
      </div>

      {/* Package cards */}
      <motion.div
        className="flex flex-col lg:flex-row items-center justify-between w-full h-full z-10 gap-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {[
          {
            key: "StarterSite",
            title: tStart("title"),
            desc: tStart("description"),
            features: [
              "customDesign",
              "responsiveFast",
              "basicSEO",
              "simpleCMS",
            ],
            tFeature: tStart,
          },
          {
            key: "WebApplication",
            title: tApp("title"),
            desc: tApp("description"),
            features: [
              <span
                key="base"
                className="text-xs font-semibold text-secondary flex items-center gap-1"
              >
                <FaPlus size={12} /> {tStart("title")}
              </span>,
              "bespokeUIUX",
              "featureRich",
              "databaseIntegration",
              "adminDashboard",
            ],
            tFeature: tApp,
          },
          {
            key: "3DPremium",
            title: t3D("title"),
            desc: t3D("description"),
            features: [
              <span
                key="base"
                className="text-xs font-semibold text-secondary flex items-center gap-1"
              >
                <FaPlus size={12} /> {tApp("title")}
              </span>,
              "sleekLayout",
              "parallaxEffects",
              "integrated3D",
              "performance",
            ],
            tFeature: t3D,
          },
        ].map(({ key, title, desc, features, tFeature }) => (
          <div key={key} className="relative" aria-label={title}>
            <div className="flex flex-col justify-between shadow-lg rounded-xl w-80 h-[500px] p-10 bg-base-100 border-zinc-400 border-b-5 shadow-zinc-800">
              <div className="flex flex-col gap-5">
                <h3 className="text-2xl font-bold">{title}</h3>
                <p className="text-sm">{desc}</p>
              </div>
              <ul className="flex flex-col gap-4">
                {features.map((f, idx) =>
                  typeof f === "string" ? (
                    <li key={f} className="flex gap-2 items-center">
                      <FaCheck className="text-primary" size={20} />
                      <span className="text-sm font-semibold">
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
            <div className="absolute left-0 bottom-0 w-[320px] rounded-2xl flash h-8 -z-10" />
          </div>
        ))}
      </motion.div>

      <p className="text-xs text-zinc-500">{t("PricingPage.vatNote")}</p>
    </div>
  );
};

export default Plans;
