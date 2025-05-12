"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaCheck, FaPlus } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase-browser";

interface Package {
  label: string;
  price_eur: number;
  price_dkk: number;
}

const Prices: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [packages, setPackages] = useState<Record<string, Package>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("label, price_eur, price_dkk")
        .order("price_eur", { ascending: true });

      if (error) {
        console.error("Failed loading prices:", error);
      } else if (data) {
        const pkgList = data as Package[];

        const keyToLabel: Record<string, string> = {
          StarterSite: "Starter Site",
          WebApplication: "Web Application",
          "3DPremium": "3D Premium",
        };

        const map: Record<string, Package> = {};
        pkgList.forEach((p) => {
          const match = Object.entries(keyToLabel).find(
            ([, lab]) => lab === p.label
          );
          if (match) {
            map[match[0]] = p;
          }
        });

        setPackages(map);
      }

      setLoading(false);
    };

    load();
  }, []);

  const getPrice = (key: string) => {
    if (loading) return "…";
    const pkg = packages[key];
    if (!pkg) return t("startingFrom") + "…";

    const isDanish = i18n.language.startsWith("da");
    const value = isDanish ? pkg.price_dkk : pkg.price_eur;
    const currency = isDanish ? "DKK" : "EUR";

    return new Intl.NumberFormat(i18n.language, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative">
      {/* Title & subtitle */}
      <div className="flex flex-col items-center gap-3 mb-10">
        <h3 className="text-2xl md:text-3xl text-primary font-light">
          {t("Pricing.title")}
        </h3>
        <span className="tracking-wide text-sm md:text-base">
          {t("Pricing.subtitle")}
        </span>
      </div>

      {/* Package cards */}
      <motion.div
        className="flex flex-col lg:flex-row items-center justify-evenly gap-4 w-full h-full z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Starter Site */}
        <div className="relative">
          <div className="flex flex-col justify-between shadow-lg rounded-xl w-80 h-[500px] p-10 bg-base-100 border-zinc-400 border-b-5 shadow-zinc-800">
            <div className="flex flex-col gap-5">
              <h3 className="text-2xl font-bold">{t("StarterSite.title")}</h3>
              <p className="text-sm">{t("StarterSite.description")}</p>
            </div>
            <ul className="flex flex-col gap-4">
              {["customDesign", "responsiveFast", "basicSEO", "simpleCMS"].map(
                (f) => (
                  <li key={f} className="flex gap-2 items-center">
                    <FaCheck className="text-primary" size={20} />
                    <span className="text-sm font-semibold">
                      {t(`StarterSite.features.${f}`)}
                    </span>
                  </li>
                )
              )}
            </ul>
            <div className="flex gap-5 items-end">
              <span>{t("startingFrom")}</span>
              <span className="text-3xl font-semibold tracking-wide">
                {getPrice("StarterSite")}
              </span>
            </div>
          </div>
          <div className="absolute left-0 bottom-0 w-[320px] rounded-2xl flash h-8 -z-10" />
        </div>

        {/* Web Application */}
        <div className="relative">
          <div className="flex flex-col justify-between shadow-lg rounded-xl w-80 h-[500px] p-10 border-primary border-b-5 shadow-zinc-800 bg-base-100">
            <div className="flex flex-col gap-5">
              <h3 className="text-2xl font-bold">
                {t("WebApplication.title")}
              </h3>
              <p className="text-sm">{t("WebApplication.description")}</p>
            </div>
            <ul className="flex flex-col gap-4">
              <li className="flex gap-2 items-center">
                <FaPlus className="text-primary" size={15} />
                <span className="text-xs font-semibold text-secondary">
                  {t("StarterSite.title")}
                </span>
              </li>
              {[
                "bespokeUIUX",
                "featureRich",
                "databaseIntegration",
                "adminDashboard",
              ].map((f) => (
                <li key={f} className="flex gap-2 items-center">
                  <FaCheck className="text-primary" size={20} />
                  <span className="text-sm font-semibold">
                    {t(`WebApplication.features.${f}`)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex gap-5 items-end">
              <span>{t("startingFrom")}</span>
              <span className="text-3xl font-semibold tracking-wide">
                {getPrice("WebApplication")}
              </span>
            </div>
          </div>
          <div className="absolute left-0 bottom-0 bg-primary w-80 rounded-xl flash-popular h-4 -z-10" />
        </div>

        {/* 3D Premium */}
        <div className="relative">
          <div className="flex flex-col justify-between shadow-lg border-zinc-400 border-b-5 rounded-xl w-80 h-[500px] p-10 bg-base-100 shadow-zinc-800">
            <div className="flex flex-col gap-5">
              <h3 className="text-2xl font-bold">{t("3DPremium.title")}</h3>
              <p className="text-sm">{t("3DPremium.description")}</p>
            </div>
            <ul className="flex flex-col gap-4">
              <li className="flex gap-2 items-center">
                <FaPlus className="text-primary" size={15} />
                <span className="text-xs font-semibold text-secondary">
                  {t("WebApplication.title")}
                </span>
              </li>
              {[
                "sleekLayout",
                "parallaxEffects",
                "integrated3D",
                "performance",
              ].map((f) => (
                <li key={f} className="flex gap-2 items-center">
                  <FaCheck className="text-primary" size={20} />
                  <span className="text-sm font-semibold">
                    {t(`3DPremium.features.${f}`)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex gap-5 items-end">
              <span>{t("startingFrom")}</span>
              <span className="text-3xl font-semibold tracking-wide">
                {getPrice("3DPremium")}
              </span>
            </div>
          </div>
          <div className="absolute left-0 bottom-0 w-[320px] rounded-2xl flash h-8 -z-10" />
        </div>
      </motion.div>

      {/* CTA */}
      <div className="flex flex-col items-center justify-center gap-5 mt-10">
        <h3 className="text-lg">{t("customQuotePrompt")}</h3>
        <Link href="/get-started" className="btn btn-primary">
          {t("getQuote")}
        </Link>
      </div>
    </div>
  );
};

export default Prices;
