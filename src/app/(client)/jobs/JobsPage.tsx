"use client";

import JobsList from "@/components/client/jobs/JobsList";
import Image from "next/image";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const JobsPage = () => {
  const { t } = useTranslation();
  const [hasJobs, setHasJobs] = useState(true); // Assume jobs exist initially

  return (
    <div className="p-5 md:p-8 w-full h-full flex flex-col gap-10 md:gap-15 xl:gap-28 justify-center items-center my-10 md:my-20">
      <div className="max-w-[300px] md:max-w-[460px]">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center">
          {t("jobsPage.titleStart")}
          <span className="text-primary"> {t("jobsPage.titleEnd")} </span>
        </h1>
      </div>

      {hasJobs ? (
        <JobsList setHasJobs={setHasJobs} />
      ) : (
        <div className="max-w-2xl flex flex-col items-center justify-center text-center text-sm md:text-base space-y-5">
          <h2 className="text-lg md:text-xl font-semibold">
            {t("jobsPage.noOpeningsTitle")}
          </h2>
          <p className="text-neutral-300">{t("jobsPage.noOpenings")}</p>
          <p className="flex gap-1 items-center justify-center">
            {t("jobsPage.contactMail")}
            <a
              href="mailto:mail@arzonic.com"
              className="text-secondary font-medium hover:underline break-all"
            >
              mail@arzonic.com
            </a>
          </p>
          <Image
            src="/elements/rocket.png"
            alt=""
            className="rotate-45"
            width={70}
            height={70}
          />
        </div>
      )}
    </div>
  );
};

export default JobsPage;
