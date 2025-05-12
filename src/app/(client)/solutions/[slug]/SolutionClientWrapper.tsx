"use client";

import { useParams } from "next/navigation";
import SolutionClient from "./SolutionClient";

const allowedSlugs = [
  "custom-websites",
  "web-applications",
  "3d-visualization",
  "design-animation",
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
