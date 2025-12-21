"use client";

import { useParams } from "next/navigation";
import SolutionClient from "./SolutionClient";

const allowedSlugs = [
  "web-applications",
  "design-ux",
  "3d-visualization",
  "systems-integrations",
] as const;

type SolutionSlug = (typeof allowedSlugs)[number];

const SolutionClientWrapper = () => {
  const { slug } = useParams() as { slug?: string };

  if (!slug || !allowedSlugs.includes(slug as SolutionSlug)) {
    return <div>Not found</div>;
  }

  return <SolutionClient slug={slug as SolutionSlug} countryName="default" />;
};

export default SolutionClientWrapper;
