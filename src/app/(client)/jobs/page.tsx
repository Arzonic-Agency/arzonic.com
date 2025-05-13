"use client";

import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

const JobsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-5 sm:p-7 w-full h-full flex flex-col gap-12 md:gap-20 xl:gap-32 justify-center items-center my-20">
      {/* Titel */}
      <div className="max-w-[260px] md:max-w-3xl text-center">
        <h1 className="text-3xl md:text-5xl font-bold">
          {t("jobsPage.titleStart")}
          <span className="text-primary"> {t("jobsPage.titleEnd")} </span>
        </h1>
      </div>

      {/* Besked + kontakt */}
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
        <Image src="/elements/smile.svg" alt="" width={100} height={100} />
      </div>
    </div>
  );
};

export default JobsPage;
