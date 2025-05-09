"use client";

import { useParams } from "next/navigation";
import { solutionSEO, countries } from "@/lib/data/seoData";
import SolutionClient from "../SolutionClient";

const CountrySolutionsPage = () => {
  const params = useParams();
  const { slug, country } = params as { slug: string; country: string };

  const seo = solutionSEO[slug]?.[country];
  const countryInfo = countries[country];

  if (!seo || !countryInfo) {
    return <div>Solution or country not found</div>;
  }

  return <SolutionClient slug={slug} countryName={countryInfo.name} />;
};

export default CountrySolutionsPage;
