import { Metadata } from "next";
import ApplyPage from "./ApplyPage";
import { getJobBySlug } from "@/lib/client/actions";
import { notFound } from "next/navigation";

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
    title: `Ansøg til: ${job.title}`,
    description:
      job.subtitle || "Ansøg direkte til dette jobopslag hos Arzonic.",
    openGraph: {
      title: `Ansøg til: ${job.title}`,
      description: job.subtitle,
      url: `https://arzonic.com/apply/${slug}`,
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

  return <ApplyPage job={job} />;
}
