"use client";

import { useParams } from "next/navigation";
import { solutionSEO } from "@/lib/data/seoData";
import SolutionClient from "./SolutionClient";

const SolutionClientWrapper = () => {
  const { slug } = useParams() as { slug: string };
  const seo = solutionSEO[slug]?.default;

  if (!seo) return <div>Not found</div>;

  return <SolutionClient slug={slug} countryName="Europe" />;
};

export default SolutionClientWrapper;
