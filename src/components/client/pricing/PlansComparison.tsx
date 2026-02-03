"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaCircleInfo, FaSquareCheck } from "react-icons/fa6";
import { getPackages, getExtraServices } from "@/lib/server/client-actions";
import { useTranslation } from "react-i18next";

interface DBPackage {
  label: string;
  yearly_eur: number;
  yearly_dkk?: number;
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

type PlanKey = "starter" | "growth" | "dedicated";

const featureKeys = [
  "serviceFee",
  "customDesign",
  "dashboard",
  "responsive",
  "contactForm",
  "seo",
  "cms",
  "SoMe",
  "analytics",
  "login",
  "mail",
  "database",
  "users",
  "3d",
  "scroll",
] as const;

const planKeys: PlanKey[] = ["starter", "growth", "dedicated"];

interface PlansComparisonProps {
  pricingType: "yearly" | "monthly";
}

const PlansComparison = ({ pricingType }: PlansComparisonProps) => {
  const { t, i18n } = useTranslation();
  const translate = (key: string) => t(`plansComparison.${key}`);
  const translateAria = (key: string) =>
    t(`aria.plansComparison.${key}`, {
      defaultValue: "Get started with pricing comparison",
    });

  const [pkgMap, setPkgMap] = useState<Partial<Record<PlanKey, DBPackage>>>({});
  const [extraServices, setExtraServices] = useState<DBExtraService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("starter");

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
          if (lab.includes("starter")) map.starter = p;
          else if (lab.includes("growth")) map.growth = p;
          else if (lab.includes("scale")) map.dedicated = p;
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
    if (key === "dedicated") return t("PricingPage.priceOnRequest");
    if (loading) return "…";
    const pkg = pkgMap[key];
    if (!pkg) return "–";
    const value =
      pricingType === "monthly"
        ? isDanish && pkg.month_dkk != null
          ? pkg.month_dkk
          : pkg.month_eur
        : isDanish && pkg.yearly_dkk != null
        ? pkg.yearly_dkk
        : pkg.yearly_eur;
    const currency = isDanish ? "DKK" : "EUR";
    return formatCurrency(value, currency);
  };

  const isStarterExtraAllowed = (labelEn: string, labelDk?: string) => {
    const label = `${labelEn} ${labelDk ?? ""}`.toLowerCase();
    const allowed = ["nyhedsbrev", "newsletter", "booking", "bookingsystem"];
    return allowed.some((term) => label.includes(term));
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
  const tp = (key: string) => t(`plans.${key}`);

  const rawPlans = planKeys.map((key) => {
    return {
      key,
      name: tp(`${key}.name`),

      values: featureKeys.map((fk) => {
        if (fk === "serviceFee")
          return (
            <FaSquareCheck
              key={`${key}-serviceFee`}
              size={20}
              className="text-secondary"
            />
          );

        if (fk === "seo" || fk === "cms") {
          return (
            <span
              key={`${key}-${fk}`}
              className="text-xs sm:text-sm font-medium text-zinc-300"
            >
              {tp(`${key}.${fk}`)}
            </span>
          );
        }
        const idx = featureKeys.indexOf(fk);
        const has = (() => {
          if (key === "starter") return [0, 1, 2, 3, 4, 7, 8].includes(idx);
          if (key === "growth")
            return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].includes(idx);
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
      <div className="hidden md:flex flex-col gap-10 items-center w-full ">
        <h2 className="text-xl md:text-3xl font-light text-center">
          {translate("title")}
        </h2>

        <div className="mt-8 rounded-xl overflow-hidden w-full max-w-5xl bg-base-100">
          <table className="min-w-full border-3 border-base-200 rounded-xl">
            <thead className="bg-base-200">
              <tr>
                <th className="p-5 text-left">
                  {translate("table.featureColumn")}
                </th>
                {rawPlans.map((plan) => (
                  <th key={plan.key} className="p-5 text-left">
                    <div className="font-semibold">{plan.name}</div>
                    <div className="text-xs text-zinc-400 font-normal mt-0.5">
                      {plan.key === "dedicated"
                        ? t("PricingPage.priceOnRequest")
                        : `${t("PricingPage.from")} ${getPrice(plan.key)}`}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feat, idx) => (
                <tr key={idx}>
                  <td className="p-5 font-medium text-xs md:text-sm flex items-center gap-1">
                    {feat}
                    {featureKeys[idx] === "serviceFee" && (
                      <div
                        className="tooltip tooltip-top cursor-help"
                        data-tip={t("PricingPage.serviceAgreementTip")}
                      >
                        <FaCircleInfo
                          size={14}
                          className="text-zinc-400 shrink-0"
                        />
                      </div>
                    )}
                  </td>
                  {rawPlans.map((plan) => (
                    <td
                      key={`${plan.key}-${idx}`}
                      className="p-5 text-sm text-left"
                    >
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
                    <th className="p-5 text-left">
                      <div className="font-semibold">
                        {translate("extraServices")}
                      </div>
                      <div className="text-xs text-zinc-400 font-normal mt-0.5">
                        {translate("pricesPerMonth")}
                      </div>
                    </th>
                    {rawPlans.map((plan) => (
                      <th
                        key={`extra-head-${plan.key}`}
                        className="p-5 text-left"
                      >
                        <div className="font-semibold">{plan.name}</div>
                        <div className="text-xs text-zinc-400 font-normal mt-0.5">
                          {plan.key === "dedicated"
                            ? t("PricingPage.priceOnRequest")
                            : `${t("PricingPage.from")} ${getPrice(plan.key)}`}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {extraServices.map((service, idx) => (
                    <tr key={`desktop-extra-${idx}`}>
                      <td className="p-5 font-medium text-xs md:text-sm flex items-center gap-1 text-left">
                        {isDanish ? service.label_dk : service.label_en}
                        {(service.desc_dk || service.desc_en) && (
                          <div
                            className="tooltip tooltip-right cursor-help"
                            data-tip={
                              isDanish ? service.desc_dk : service.desc_en
                            }
                          >
                            <FaCircleInfo size={13} className="text-zinc-400" />
                          </div>
                        )}
                      </td>
                      {rawPlans.map((plan) => (
                        <td
                          key={`extra-cell-${plan.key}-${idx}`}
                          className="p-5 text-sm text-left"
                        >
                          {plan.key === "dedicated" ? (
                            <FaSquareCheck
                              size={20}
                              className="text-secondary"
                            />
                          ) : plan.key === "starter" &&
                            !isStarterExtraAllowed(
                              service.label_en,
                              service.label_dk,
                            ) ? (
                            "–"
                          ) : (
                            getExtraServicePrice(
                              service.price_dkk,
                              service.price_eur,
                            )
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </>
            )}
          </table>

          <div className="text-xs mt-3 flex justify-between items-center px-5">
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
        <div className="flex flex-col gap-2 items-start">
          <span className="text-xl font-semibold">
            {translate("selectLabel") || "Choose a plan"}
          </span>
          <div className="flex gap-3 bg-base-200 p-1 rounded-xl shadow-sm ">
            {rawPlans.map((plan) => (
              <button
                key={plan.key}
                type="button"
                aria-pressed={selectedPlan === plan.key}
                className={`px-4 py-1 rounded-lg text-[15px] font-medium transition ${
                  selectedPlan === plan.key
                    ? "bg-primary text-white"
                    : "bg-transparent text-primary"
                }`}
                onClick={() => setSelectedPlan(plan.key)}
              >
                {plan.name}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full rounded-xl border border-base-200 overflow-hidden">
          <table className="table w-full text-sm">
            <thead className="bg-base-200">
              <tr>
                <th className="p-3 text-left">
                  {translate("table.featureColumn")}
                </th>
                <th className="p-3 text-left">
                  {(() => {
                    const plan = rawPlans.find((p) => p.key === selectedPlan);
                    if (!plan) return null;
                    return (
                      <>
                        <div className="font-semibold">{plan.name}</div>
                        <div className="text-xs text-zinc-400 font-normal mt-0.5">
                          {plan.key === "dedicated"
                            ? t("PricingPage.priceOnRequest")
                            : `${t("PricingPage.from")} ${getPrice(plan.key)}`}
                        </div>
                      </>
                    );
                  })()}
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feat, idx) => (
                <tr key={`mobile-${idx}`}>
                  <td className="px-3 py-3 font-medium text-xs flex items-center gap-1 text-left">
                    {feat}
                    {featureKeys[idx] === "serviceFee" && (
                      <div
                        className="tooltip tooltip-top cursor-help"
                        data-tip={t("PricingPage.serviceAgreementTip")}
                      >
                        <FaCircleInfo
                          size={12}
                          className="text-zinc-400 shrink-0"
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-3 text-left align-top w-1/2">
                    {rawPlans.find((p) => p.key === selectedPlan)?.values[idx]}
                  </td>
                </tr>
              ))}
            </tbody>
            {extraServices.length > 0 && (
              <>
                <thead className="bg-base-200">
                  <tr>
                    <th className="p-3 text-left">
                      <div className="font-semibold">
                        {translate("extraServices")}
                      </div>
                      <div className="text-xs text-zinc-400 font-normal mt-0.5">
                        {translate("pricesPerMonth")}
                      </div>
                    </th>
                    <th className="p-3 text-left">
                      {(() => {
                        const plan = rawPlans.find(
                          (p) => p.key === selectedPlan,
                        );
                        if (!plan) return null;
                        return (
                          <>
                            <div className="font-semibold">{plan.name}</div>
                            <div className="text-xs text-zinc-400 font-normal mt-0.5">
                              {plan.key === "dedicated"
                                ? t("PricingPage.priceOnRequest")
                                : `${t("PricingPage.from")} ${getPrice(
                                    plan.key,
                                  )}`}
                            </div>
                          </>
                        );
                      })()}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {extraServices.map((service, idx) => (
                    <tr key={`extra-mobile-${idx}`}>
                      <td className="px-3 py-3 font-medium text-xs flex items-start gap-1 text-left">
                        {isDanish ? service.label_dk : service.label_en}
                        {(service.desc_dk || service.desc_en) && (
                          <div
                            className="tooltip tooltip-right cursor-help"
                            data-tip={
                              isDanish ? service.desc_dk : service.desc_en
                            }
                          >
                            <FaCircleInfo size={12} className="text-zinc-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3 text-left">
                        {selectedPlan === "dedicated" ? (
                          <FaSquareCheck size={18} className="text-secondary" />
                        ) : selectedPlan === "starter" &&
                          !isStarterExtraAllowed(
                            service.label_en,
                            service.label_dk,
                          ) ? (
                          "–"
                        ) : (
                          getExtraServicePrice(
                            service.price_dkk,
                            service.price_eur,
                          )
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
