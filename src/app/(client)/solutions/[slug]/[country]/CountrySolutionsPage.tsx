"use client";

import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import SolutionClient from "../SolutionClient";

const allowedSlugs = [
  "custom-websites",
  "web-applications",
  "3d-visualization",
  "design-animation",
] as const;

type SolutionSlug = (typeof allowedSlugs)[number];

const CountrySolutionsPage = () => {
  const { slug, country } = useParams() as { slug?: string; country?: string };
  const { t } = useTranslation();

  if (!slug || !country || !allowedSlugs.includes(slug as SolutionSlug)) {
    return <div>Solution or country not found</div>;
  }

  const allCountries = t("countries", { returnObjects: true }) as Record<
    string,
    string
  >;
  const countryName = allCountries[country] || country;

  return (
    <SolutionClient slug={slug as SolutionSlug} countryName={countryName} />
  );
};

export default CountrySolutionsPage;
