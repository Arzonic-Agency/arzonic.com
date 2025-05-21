import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSquareCheck } from "react-icons/fa6";
import { supabase } from "@/lib/supabase-browser";
import Image from "next/image";

interface DBPackage {
  label: string;
  price_eur: number;
  price_dkk?: number;
}

type PlanKey = "StarterSite" | "WebApplication" | "3DPremium";

const featureKeys = [
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

const planKeys: PlanKey[] = ["StarterSite", "WebApplication", "3DPremium"];

const PricingComparison: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [pkgMap, setPkgMap] = useState<Partial<Record<PlanKey, DBPackage>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("label, price_eur, price_dkk");

      if (error) {
        console.error("Failed to load packages:", error);
      } else if (data) {
        const list = data as DBPackage[];
        const map: Partial<Record<PlanKey, DBPackage>> = {};
        list.forEach((p) => {
          const lab = p.label.toLowerCase();
          if (lab.includes("starter")) {
            map.StarterSite = p;
          } else if (lab.includes("application") || lab.includes("web")) {
            map.WebApplication = p;
          } else if (lab.includes("premium") || lab.includes("3")) {
            map["3DPremium"] = p;
          }
        });
        setPkgMap(map);
      }
      setLoading(false);
    };
    load();
  }, []);

  const isDanish = i18n.language.startsWith("da");
  const getPrice = (key: PlanKey) => {
    if (loading) return "…";
    const pkg = pkgMap[key];
    if (!pkg) return "–";
    const value =
      isDanish && pkg.price_dkk != null ? pkg.price_dkk : pkg.price_eur;
    const currency = isDanish ? "DKK" : "EUR";
    return new Intl.NumberFormat(i18n.language, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Build table data
  const features = featureKeys.map((k) => t(`pricingComparison.features.${k}`));
  const rawPlans = planKeys.map((key) => ({
    key,
    name: t(
      `pricingComparison.plans.${
        key === "StarterSite"
          ? "start"
          : key === "WebApplication"
          ? "app"
          : "premium"
      }.name`
    ),
    values: featureKeys.map((fk) => {
      if (fk === "seo" || fk === "cms") {
        const planKey =
          key === "StarterSite"
            ? "start"
            : key === "WebApplication"
            ? "app"
            : "premium";

        return t(`pricingComparison.plans.${planKey}.${fk}`);
      }

      const has = (() => {
        if (key === "StarterSite")
          return [0, 1].includes(featureKeys.indexOf(fk));
        if (key === "WebApplication")
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
  }));

  return (
    <>
      <div className="hidden md:flex flex-col gap-10">
        <h2 className="text-xl md:text-3xl font-light text-center">
          {t("pricingComparison.title")}
        </h2>

        <div className="overflow-x-auto mt-8 rounded-xl overflow-hidden">
          <table className="min-w-full border-3 border-base-200 rounded-xl">
            <thead className="bg-base-200">
              <tr>
                <th className="p-3 text-left">
                  {t("pricingComparison.table.featureColumn")}
                </th>
                {rawPlans.map((plan) => (
                  <th key={plan.key} className="p-3 text-left">
                    <div className="font-semibold">{plan.name}</div>
                    <div className="text-sm font-medium text-zinc-500">
                      {t("startingFrom")} {getPrice(plan.key)}
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
              <p>{t("pricingComparison.vatNote")}</p>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <FaSquareCheck size={14} className="text-secondary" />{" "}
              {t("pricingComparison.legend")}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-5 mt-10 relative">
        <Image
          src="/elements/rocket.png"
          alt="Rocket illustration"
          width={80}
          height={80}
          className="absolute -top-26 block md:hidden"
        />
        <h3 className="text-base">{t("pricingComparison.title-btn")}</h3>
        <Link
          href="/get-started"
          className="btn btn-primary"
          aria-label={t("aria.pricingComparison.getStartedButton", "Get started with pricing comparison")}
        >
          {t("pricingComparison.text-btn")}
        </Link>
      </div>
    </>
  );
};

export default PricingComparison;
