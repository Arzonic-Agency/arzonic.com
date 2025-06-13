import JobDetailsPage from "./JobDetailsPage";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getJobBySlug } from "@/lib/client/actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return {
      title: "Jobopslag ikke fundet | Arzonic",
      description: "Vi kunne ikke finde dette jobopslag.",
    };
  }

  return {
    title: `${job.title}`,
    description:
      job.subtitle || "Se detaljerne for dette jobopslag hos Arzonic.",
    openGraph: {
      title: `${job.title}`,
      description: job.subtitle,
      url: `https://arzonic.com/jobs/${slug}`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return notFound();

  return <JobDetailsPage job={job} />;
}
