"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaSquareCheck } from "react-icons/fa6";
import Image from "next/image";
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
  "booking",
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

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPackages();
        const map: Partial<Record<PlanKey, DBPackage>> = {};
        data.forEach((p) => {
          const lab = p.label.toLowerCase();
          if (lab.includes("starter")) {
            map.Starter = p;
          } else if (lab.includes("pro")) {
            map.Pro = p;
          } else if (lab.includes("premium") || lab.includes("3")) {
            map.Premium = p;
          }
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
        if (fk === "serviceFee") {
          return getFee(key);
        }

        if (fk === "seo" || fk === "cms") {
          return translate(`plans.${shortKey}.${fk}`);
        }

        const has = (() => {
          if (key === "Starter")
            return [0, 1].includes(featureKeys.indexOf(fk));
          if (key === "Pro")
            return [0, 1, 4, 5, 6, 7].includes(featureKeys.indexOf(fk));
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

      {/* Mobile */}
      <div className="flex flex-col items-center justify-center gap-5 mt-10 relative">
        <Image
          src="/elements/rocket.png"
          alt="Rocket illustration"
          width={80}
          height={80}
          className="absolute -top-26 block md:hidden"
        />
        <h3 className="text-base">{translate("title-btn")}</h3>
        <Link
          href="/get-started"
          className="btn btn-primary"
          aria-label={translateAria("getStartedButton")}
        >
          {translate("text-btn")}
        </Link>
      </div>
    </>
  );
};

export default PlansComparison;
