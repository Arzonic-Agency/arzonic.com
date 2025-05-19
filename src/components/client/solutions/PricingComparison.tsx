import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaSquareCheck } from "react-icons/fa6";

const pricingData = (t) => ({
  features: [
    t("pricingComparison.features.customDesign"),
    t("pricingComparison.features.responsive"),
    t("pricingComparison.features.seo"),
    t("pricingComparison.features.cms"),
    t("pricingComparison.features.login"),
    t("pricingComparison.features.booking"),
    t("pricingComparison.features.dashboard"),
    t("pricingComparison.features.database"),
    t("pricingComparison.features.3d"),
    t("pricingComparison.features.scroll"),
  ],
  plans: [
    {
      name: t("pricingComparison.plans.start.name"),
      price: t("pricingComparison.plans.start.price"),
      values: [
        <FaSquareCheck key="start-0" size={20} className="text-secondary" />,
        <FaSquareCheck key="start-1" size={20} className="text-secondary" />,
        t("pricingComparison.plans.start.seo"),
        t("pricingComparison.plans.start.cms"),
        "–",
        "–",
        "–",
        "–",
        "–",
        "–",
      ],
    },
    {
      name: t("pricingComparison.plans.app.name"),
      price: t("pricingComparison.plans.app.price"),
      values: [
        <FaSquareCheck key="app-0" size={20} className="text-secondary" />,
        <FaSquareCheck key="app-1" size={20} className="text-secondary" />,
        t("pricingComparison.plans.app.seo"),
        t("pricingComparison.plans.app.cms"),
        <FaSquareCheck key="app-4" size={20} className="text-secondary" />,
        <FaSquareCheck key="app-5" size={20} className="text-secondary" />,
        <FaSquareCheck key="app-6" size={20} className="text-secondary" />,
        <FaSquareCheck key="app-7" size={20} className="text-secondary" />,
        "–",
        "–",
      ],
    },
    {
      name: t("pricingComparison.plans.premium.name"),
      price: t("pricingComparison.plans.premium.price"),
      values: [
        <FaSquareCheck key="premium-0" size={20} className="text-secondary" />,
        <FaSquareCheck key="premium-1" size={20} className="text-secondary" />,
        t("pricingComparison.plans.premium.seo"),
        t("pricingComparison.plans.premium.cms"),
        <FaSquareCheck key="premium-4" size={20} className="text-secondary" />,
        <FaSquareCheck key="premium-5" size={20} className="text-secondary" />,
        <FaSquareCheck key="premium-6" size={20} className="text-secondary" />,
        <FaSquareCheck key="premium-7" size={20} className="text-secondary" />,
        <FaSquareCheck key="premium-8" size={20} className="text-secondary" />,
        <FaSquareCheck key="premium-9" size={20} className="text-secondary" />,
      ],
    },
  ],
});

const PricingComparison = () => {
  const { t } = useTranslation();
  const data = pricingData(t);

  return (
    <div className="hidden md:flex flex-col gap-10">
      <h2 className="text-xl sm:text-xl md:text-3xl font-light text-center">
        {t("pricingComparison.title")}
      </h2>
      <div className="overflow-x-auto mt-8 rounded-xl overflow-hidden">
        <table className="min-w-full border-3 border-base-200 rounded-xl">
          <thead className="bg-base-200">
            <tr>
              <th className="p-3 text-left">
                {t("pricingComparison.table.featureColumn")}
              </th>
              {data.plans.map((plan) => (
                <th key={plan.name} className="p-3 text-left">
                  <div className="font-semibold">{plan.name}</div>
                  <div className="text-sm font-medium text-zinc-500">
                    {t("startingFrom", { price: plan.price })}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.features.map((feature, idx) => (
              <tr key={feature}>
                <td className="px-3 py-4 font-medium text-xs md:text-sm">
                  {feature}
                </td>
                {data.plans.map((plan) => (
                  <td key={plan.name + idx} className="p-3 text-sm">
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
      <div className="flex flex-col items-center justify-center gap-5 mt-10">
        <h3 className="text-base">{t("customQuotePrompt")}</h3>
        <Link href="/get-started" className="btn btn-primary">
          {t("getQuote")}
        </Link>
      </div>
    </div>
  );
};

export default PricingComparison;
