"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaBriefcase } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { format } from "date-fns";
import { da, enUS } from "date-fns/locale";
import Link from "next/link";
import { getAllActiveJobs } from "@/lib/client/actions";
import { useTranslation } from "react-i18next";

type Job = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  type: string;
  workplace: string;
  created_at: string;
};

const JobsList = ({
  setHasJobs,
}: {
  setHasJobs: (hasJobs: boolean) => void;
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const dateLocale = locale === "da" ? da : enUS;

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const { requests } = await getAllActiveJobs();
        setJobs(requests);
        setHasJobs(requests.length > 0);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        setHasJobs(false);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [setHasJobs]);

  if (loading) {
    return (
      <div className="flex justify-center gap-3 items-center w-full">
        <span className="loading loading-dots loading-xl text-secondary h-96" />
      </div>
    );
  }

  if (jobs.length === 0) return null;

  return (
    <div className="flex flex-col items-center justify-center w-full p-1 md:p-4">
      <div className="flex flex-col gap-10 items-center w-full md:max-w-2xl">
        {jobs.map((job) => (
          <Link
            href={`/jobs/${job.slug}`}
            key={job.id}
            className="flex flex-row rounded-xl bg-base-200 ring-2 p-2 ring-base-300 md:hover:bg-base-300 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-primary transition-all duration-300 ease-in-out gap-3 shadow-lg relative cursor-pointer w-full"
          >
            <div className="hidden md:block">
              <div className="h-full w-24 sm:h-32 sm:w-32 relative rounded-lg overflow-hidden">
                <Image
                  src="/backgrounds/test.png"
                  alt="Logo"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#17171797] via-transparent to-transparent z-10" />
              </div>
            </div>
            <div className="p-2 sm:p-4 flex flex-col gap-2 w-full">
              <h2 className="text-base sm:text-xl font-semibold">
                {job.title}
              </h2>
              <p className="text-sm text-zinc-400">{job.subtitle}</p>
              <div className="flex gap-5 items-center justify-between mt-2">
                <div className="flex gap-2 items-center">
                  <p className="badge badge-soft">
                    <FaBriefcase size={12} /> {job.type}
                  </p>
                  <p className="badge badge-secondary badge-soft">
                    <FaMapMarkerAlt /> {job.workplace}
                  </p>
                </div>
                <div className="text-xs sm:text-sm text-zinc-500 flex gap-1">
                  <span>
                    {format(new Date(job.created_at), "d. MMMM yyyy", {
                      locale: dateLocale,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-5 items-center justify-center text-center max-w-sm mt-20">
        <Image
          src="/elements/rocket.png"
          alt=""
          width={80}
          height={80}
          className="rotate-45"
        />
        <h2 className="text-xl font-semibold">{t("jobsPage.noMatchTitle")}</h2>
        <p className="text-sm text-zinc-400">
          {t("jobsPage.noMatchDescription")}
        </p>
        <a
          href="mailto:mail@arzonic.com"
          className="inline-block px-6 py-3 btn btn-primary"
        >
          {t("jobsPage.sendApplication")}
        </a>
      </div>
    </div>
  );
};

export default JobsList;
