"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaCircleExclamation, FaSquareCheck } from "react-icons/fa6";
import { getPackages, getExtraServices } from "@/lib/client/actions";
import { useTranslation } from "react-i18next";

interface DBPackage {
  label: string;
  price_eur: number;
  price_dkk?: number;
  fee_eur?: number;
  fee_dkk?: number;
  month_eur?: number;
  month_dkk?: number;
}

interface DBExtraService {
  label_dk: string;
  label_en: string;
  desc_dk?: string;
  desc_en?: string;
  price_dkk: number;
  price_eur: number;
}

type PlanKey = "Starter" | "Pro" | "Premium";

const featureKeys = [
  "serviceFee",
  "customDesign",
  "responsive",
  "contactForm",
  "seo",
  "cms",
  "login",
  "mail",
  "dashboard",
  "database",
  "users",
  "analytics",
  "3d",
  "scroll",
] as const;

const planKeys: PlanKey[] = ["Starter", "Pro", "Premium"];

interface PlansComparisonProps {
  pricingType: "oneTime" | "monthly";
}

const PlansComparison = ({ pricingType }: PlansComparisonProps) => {
  const { t, i18n } = useTranslation();
  const translate = (key: string) => t(`PlansComparison.${key}`);
  const translateAria = (key: string) =>
    t(`aria.plansComparison.${key}`, {
      defaultValue: "Get started with pricing comparison",
    });

  const [pkgMap, setPkgMap] = useState<Partial<Record<PlanKey, DBPackage>>>({});
  const [extraServices, setExtraServices] = useState<DBExtraService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("Starter");

  const isDanish = i18n.language.startsWith("da");

  useEffect(() => {
    const load = async () => {
      try {
        const [packageData, serviceData] = await Promise.all([
          getPackages(),
          getExtraServices(),
        ]);

        const map: Partial<Record<PlanKey, DBPackage>> = {};
        packageData.forEach((p) => {
          const lab = p.label.toLowerCase();
          if (lab.includes("starter")) map.Starter = p;
          else if (lab.includes("pro")) map.Pro = p;
          else if (lab.includes("premium") || lab.includes("3"))
            map.Premium = p;
        });

        setPkgMap(map);
        setExtraServices(serviceData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

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
      pricingType === "monthly"
        ? isDanish && pkg.month_dkk != null
          ? pkg.month_dkk
          : pkg.month_eur
        : isDanish && pkg.price_dkk != null
        ? pkg.price_dkk
        : pkg.price_eur;
    const currency = isDanish ? "DKK" : "EUR";
    return formatCurrency(value, currency);
  };

  const isBlockedForStarter = (label: string) => {
    const blocked = ["webshop", "booking", "ai"];
    return (
      label.toLowerCase().includes(blocked[0]) ||
      label.toLowerCase().includes(blocked[1]) ||
      label.toLowerCase().includes(blocked[2])
    );
  };

  const getFee = (key: PlanKey) => {
    if (loading) return "…";
    const pkg = pkgMap[key];
    if (!pkg) return "–";
    const value = isDanish ? pkg.fee_dkk : pkg.fee_eur;
    if (value == null) return "–";
    const currency = isDanish ? "DKK" : "EUR";
    return formatCurrency(value, currency);
  };

  const getExtraServicePrice = (dkk: number, eur?: number) => {
    const currency = isDanish ? "DKK" : "EUR";
    const value = isDanish ? dkk : eur ?? dkk;
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
            return [0, 1, 2, 3].includes(featureKeys.indexOf(fk));
          if (key === "Pro")
            return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(
              featureKeys.indexOf(fk)
            );
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

        <div className="mt-8 rounded-xl overflow-hidden w-full max-w-5xl">
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
                      {translate("startingFrom")} {getPrice(plan.key)}
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

            {/* Extra services w/ tooltip - DESKTOP */}
            {extraServices.length > 0 && (
              <>
                <thead className="bg-base-200">
                  <tr>
                    <th className="p-3 text-left">Ekstra services</th>
                    {rawPlans.map((plan) => (
                      <th
                        key={`extra-head-${plan.key}`}
                        className="p-3 text-left"
                      >
                        <div className="font-semibold">{plan.name}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {extraServices.map((service, idx) => (
                    <tr key={`desktop-extra-${idx}`}>
                      <td className="px-3 py-4 font-medium text-xs md:text-sm flex items-center gap-1">
                        {isDanish ? service.label_dk : service.label_en}
                        {(service.desc_dk || service.desc_en) && (
                          <div className="dropdown dropdown-start">
                            <div
                              tabIndex={0}
                              role="button"
                              className="btn btn-xs btn-circle btn-ghost cursor-pointer m-0"
                            >
                              <FaCircleExclamation size={13} />
                            </div>
                            <div
                              tabIndex={0}
                              className="dropdown-content bg-base-200 rounded-box z-1 w-64 p-2 shadow-sm text-center"
                            >
                              {isDanish ? service.desc_dk : service.desc_en}
                            </div>
                          </div>
                        )}
                      </td>
                      {rawPlans.map((plan) => (
                        <td
                          key={`extra-cell-${plan.key}-${idx}`}
                          className="p-3 text-sm"
                        >
                          {plan.key === "Starter" &&
                          isBlockedForStarter(service.label_en)
                            ? "–"
                            : getExtraServicePrice(
                                service.price_dkk,
                                service.price_eur
                              )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </>
            )}
          </table>

          <div className="text-xs mt-3 flex justify-between items-center px-3">
            <div className="text-zinc-400">
              <p>{translate("vatNote")}</p>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <FaSquareCheck size={14} className="text-secondary" />
              {translate("legend")}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile version */}
      <div className="md:hidden w-full overflow-hidden px-2 mt-10 flex flex-col gap-5">
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

        <div className="w-full rounded-xl border border-base-200 overflow-hidden">
          <table className="table w-full text-sm">
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
            {extraServices.length > 0 && (
              <>
                <thead className="bg-base-200">
                  <tr>
                    <th className="p-3">Ekstra services</th>
                    <th className="p-3">
                      {rawPlans.find((p) => p.key === selectedPlan)?.name}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {extraServices.map((service, idx) => (
                    <tr key={`extra-mobile-${idx}`}>
                      <td className="px-3 py-3 font-medium text-xs flex items-center gap-1">
                        {isDanish ? service.label_dk : service.label_en}
                        {(service.desc_dk || service.desc_en) && (
                          <div className="dropdown dropdown-start">
                            <div
                              tabIndex={0}
                              role="button"
                              className="btn btn-xs btn-circle btn-ghost m-0 cursor-pointer"
                            >
                              <FaCircleExclamation size={12} />
                            </div>
                            <div
                              tabIndex={0}
                              className="dropdown-content bg-base-200 rounded-box z-1 w-60 p-2 shadow-sm text-center"
                            >
                              {isDanish ? service.desc_dk : service.desc_en}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        {selectedPlan === "Starter" &&
                        isBlockedForStarter(service.label_en)
                          ? "–"
                          : getExtraServicePrice(
                              service.price_dkk,
                              service.price_eur
                            )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}
          </table>
        </div>

        <div className="text-xs mt-2 flex flex-col gap-1 text-zinc-400">
          <p>{translate("vatNote")}</p>
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
