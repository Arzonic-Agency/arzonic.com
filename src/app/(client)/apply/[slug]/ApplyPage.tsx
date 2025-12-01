"use client";

import JobsApplyForm from "@/components/client/jobs/JobsApplyForm";
import Link from "next/link";
import { useTranslation } from "react-i18next";

type Props = {
  job: {
    id: string;
    slug: string;
    title: string;
  };
};

const ApplyPage = ({ job }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="p-5 md:p-8 w-full h-full flex flex-col gap-10 md:gap-15 justify-center items-center relative my-10 md:my-20">
      <div className="md:max-w-[470px]">
        <h1 className="text-lg font-bold mb-6 flex md:flex-row flex-col gap-2 items-center">
          <span className="text-primary text-xl">
            {t("applyJobForm.applyTo")}
          </span>
          <Link
            href={`/jobs/${job.slug}`}
            className="text-foreground hover:underline transition-colors"
          >
            {job.title}
          </Link>
        </h1>
      </div>
      <JobsApplyForm title={job.title} job_id={job.id} slug={job.slug} />
    </div>
  );
};

export default ApplyPage;
