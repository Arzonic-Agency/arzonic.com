"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaSquareCheck } from "react-icons/fa6";
import { getPackages } from "@/lib/client/actions";
import { useTranslation } from "react-i18next";

interface DBPackage {
  label: string;
  price_eur: number;
  price_dkk?: number;
  fee_eur?: number;
  fee_dkk?: number;
}

type PlanKey = "Starter" | "Pro" | "Premium";

const featureKeys = [
  "serviceFee",
  "customDesign",
  "responsive",
  "seo",
  "cms",
  "login",
  "mail",
  "dashboard",
  "database",
  "3d",
  "scroll",
] as const;

const planKeys: PlanKey[] = ["Starter", "Pro", "Premium"];

const PlansComparison = () => {
  const { t, i18n } = useTranslation();
  const translate = (key: string) => t(`PlansComparison.${key}`);
  const translateAria = (key: string) =>
    t(`aria.plansComparison.${key}`, {
      defaultValue: "Get started with pricing comparison",
    });

  const [pkgMap, setPkgMap] = useState<Partial<Record<PlanKey, DBPackage>>>({});
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("Starter");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPackages();
        const map: Partial<Record<PlanKey, DBPackage>> = {};
        data.forEach((p) => {
          const lab = p.label.toLowerCase();
          if (lab.includes("starter")) map.Starter = p;
          else if (lab.includes("pro")) map.Pro = p;
          else if (lab.includes("premium") || lab.includes("3"))
            map.Premium = p;
        });
        setPkgMap(map);
      } catch (error) {
        console.error("Failed to load packages:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const isDanish = i18n.language.startsWith("da");

  const formatCurrency = (value: number, currency: string) =>
    new Intl.NumberFormat(i18n.language, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(value);

  const getPrice = (key: PlanKey) => {
    if (loading) return "…";
    const pkg = pkgMap[key];
    if (!pkg) return "–";
    const value =
      isDanish && pkg.price_dkk != null ? pkg.price_dkk : pkg.price_eur;
    const currency = isDanish ? "DKK" : "EUR";
    return formatCurrency(value, currency);
  };

  const getFee = (key: PlanKey) => {
    if (loading) return "…";
    const pkg = pkgMap[key];
    if (!pkg) return "–";
    const value = isDanish && pkg.fee_dkk != null ? pkg.fee_dkk : pkg.fee_eur;
    if (value == null) return "–";
    const currency = isDanish ? "DKK" : "EUR";
    return formatCurrency(value, currency);
  };

  const features = featureKeys.map((k) => translate(`features.${k}`));

  const rawPlans = planKeys.map((key) => {
    const shortKey =
      key === "Starter" ? "starter" : key === "Pro" ? "pro" : "premium";
    return {
      key,
      name: translate(`plans.${shortKey}.name`),
      values: featureKeys.map((fk) => {
        if (fk === "serviceFee") return getFee(key);
        if (fk === "seo" || fk === "cms")
          return translate(`plans.${shortKey}.${fk}`);
        const has = (() => {
          if (key === "Starter")
            return [0, 1, 2].includes(featureKeys.indexOf(fk));
          if (key === "Pro")
            return [0, 1, 2, 4, 5, 6, 7].includes(featureKeys.indexOf(fk));
          return true;
        })();
        return has ? (
          <FaSquareCheck
            key={`${key}-${fk}`}
            size={20}
            className="text-secondary"
          />
        ) : (
          "–"
        );
      }),
    };
  });

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:flex flex-col gap-10 items-center w-full">
        <h2 className="text-xl md:text-3xl font-light text-center">
          {translate("title")}
        </h2>

        <div className="overflow-x-auto mt-8 rounded-xl overflow-hidden w-full max-w-5xl">
          <table className="min-w-full border-3 border-base-200 rounded-xl">
            <thead className="bg-base-200">
              <tr>
                <th className="p-3 text-left">
                  {translate("table.featureColumn")}
                </th>
                {rawPlans.map((plan) => (
                  <th key={plan.key} className="p-3 text-left">
                    <div className="font-semibold">{plan.name}</div>
                    <div className="text-sm font-medium text-zinc-500">
                      {translate("startingFrom") + " " + getPrice(plan.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feat, idx) => (
                <tr key={idx}>
                  <td className="px-3 py-4 font-medium text-xs md:text-sm">
                    {feat}
                  </td>
                  {rawPlans.map((plan) => (
                    <td key={`${plan.key}-${idx}`} className="p-3 text-sm">
                      {plan.values[idx]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-xs mt-3 flex justify-between items-center px-3">
            <div className="text-zinc-400">
              <p>{translate("vatNote")}</p>
              <p>{translate("serviceFeeNote")}</p>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <FaSquareCheck size={14} className="text-secondary" />
              {translate("legend")}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile: Select + Single Plan Table Styled Like Desktop */}
      <div className="md:hidden w-full px-2 mt-10 space-y-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="plan-select" className="text-sm font-medium">
            {translate("selectLabel") || "Choose a plan"}
          </label>
          <select
            id="plan-select"
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value as PlanKey)}
            className="select select-bordered w-full"
          >
            {rawPlans.map((plan) => (
              <option key={plan.key} value={plan.key}>
                {plan.name}
              </option>
            ))}
          </select>
        </div>

        {/* Styled Plan Table */}
        <div className="overflow-x-auto w-full rounded-xl border border-base-200">
          <table className="table w-full text-xs">
            <thead className="bg-base-200">
              <tr>
                <th className="p-3">{translate("table.featureColumn")}</th>
                <th className="p-3">
                  {rawPlans.find((p) => p.key === selectedPlan)?.name}
                  <div className="text-xs font-medium text-zinc-400 mt-1">
                    {translate("startingFrom")} {getPrice(selectedPlan)}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feat, idx) => (
                <tr key={`mobile-${idx}`}>
                  <td className="px-3 py-3 font-medium text-xs">{feat}</td>
                  <td className="px-3 py-3">
                    {rawPlans.find((p) => p.key === selectedPlan)?.values[idx]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Note & Button */}
        <div className="text-xs mt-2 flex flex-col gap-1 text-zinc-400">
          <p>{translate("vatNote")}</p>
          <p>{translate("serviceFeeNote")}</p>
          <div className="flex gap-2">
            <FaSquareCheck size={14} className="text-secondary" />
            {translate("legend")}
          </div>
        </div>

        <Link
          href="/get-started"
          className="btn btn-primary w-full"
          aria-label={translateAria("getStartedButton")}
        >
          {translate("text-btn")}
        </Link>
      </div>
    </>
  );
};

export default PlansComparison;
