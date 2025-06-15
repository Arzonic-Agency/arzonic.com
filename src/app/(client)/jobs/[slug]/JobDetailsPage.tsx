"use client";

import { FaMapMarkerAlt } from "react-icons/fa";
import { FaBriefcase, FaCalendarCheck } from "react-icons/fa6";
import { format } from "date-fns";
import { da, enUS } from "date-fns/locale";
import Link from "next/link";
import { useTranslation } from "react-i18next";

type Job = {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  type: string;
  workplace: string;
  start_type?: string | null;
  start_date?: string | null;
  deadline: string;
  created_at: string;
  slug: string;
};

type Props = {
  job: Job;
};

const JobDetailsPage = ({ job }: Props) => {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language === "da" ? da : enUS;

  return (
    <>
      <section
        className="relative w-full h-[25vh] md:h-[35vh] flex items-center justify-center bg-cover bg-center opacity-90"
        style={{ backgroundImage: `url('/backgrounds/test.png')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-transparent to-transparent z-10" />
        <div className="relative z-20 text-center text-white px-4 max-w-lg md:max-w-xl lg:max-w-3xl pt-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {job.title}
          </h1>
        </div>
      </section>

      <section className="p-5 sm:p-7 w-full flex flex-col items-start gap-10 max-w-6xl mx-auto my-10 md:my-7">
        <aside className="mb-5 flex justify-between items-stat md:items-center w-full pr-0 md:pr-10">
          <ul className="list-none flex gap-3 md:gap-5 items-start flex-col md:flex-row">
            <li>
              <span className="badge badge-soft md:badge-lg">
                <FaCalendarCheck />
                {job.start_type ||
                  format(new Date(job.start_date!), "d. MMMM yyyy", {
                    locale: currentLocale,
                  })}
              </span>
            </li>
            <li>
              <span className="badge md:badge-lg badge-soft">
                <FaBriefcase /> {job.type}
              </span>
            </li>
            <li>
              <span className="badge badge-secondary badge-soft md:badge-lg">
                <FaMapMarkerAlt /> {job.workplace}
              </span>
            </li>
          </ul>

          <span className="text-xs sm:text-sm text-zinc-500">
            {format(new Date(job.created_at), "d. MMMM yyyy", {
              locale: currentLocale,
            })}
          </span>
        </aside>

        <p className="text-xl md:text-3xl font-semibold tracking-wide">
          {job.subtitle}
        </p>

        <div
          className="max-w-none text-[15px] leading-relaxe tracking-wide text-neutral-content
          [&>p]:mb-4
          [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mb-2
          [&>h3:not(:first-of-type)]:mt-10
          [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ul]:mt-4 [&>ul]:flex [&>ul]:flex-col [&>ul]:gap-2
          [&>li]:mb-2
          [&>strong]:font-semibold
          [&>hr]:my-6 border-neutral-700"
          dangerouslySetInnerHTML={{ __html: job.desc }}
        />

        <Link href={`/apply/${job.slug}`} className="btn btn-primary">
          {t("jobsDetails.apply")}
        </Link>

        <div>
          <strong>{t("jobsDetails.deadline")}:</strong>{" "}
          {format(new Date(job.deadline), "d. MMMM yyyy", {
            locale: currentLocale,
          })}
        </div>
      </section>
    </>
  );
};

export default JobDetailsPage;
