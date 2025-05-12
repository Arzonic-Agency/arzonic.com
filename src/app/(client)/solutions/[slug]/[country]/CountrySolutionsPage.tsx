"use client";

import { useParams } from "next/navigation";
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

  if (!slug || !country || !allowedSlugs.includes(slug as SolutionSlug)) {
    return <div>Solution or country not found</div>;
  }

  return <SolutionClient slug={slug as SolutionSlug} countryName={country} />;
};

export default CountrySolutionsPage;
