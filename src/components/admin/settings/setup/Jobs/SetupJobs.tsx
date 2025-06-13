"use client";

import React from "react";
import SetupJobsList from "./SetupJobsList";
import { useTranslation } from "react-i18next";

interface Job {
  id: string;
  title: string;
}

interface SetupJobsProps {
  onEdit: (job: Job) => void;
  onCreate: () => void;
}

const SetupJobs = ({ onEdit, onCreate }: SetupJobsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-5 w-full">
      <h3 className="text-xl">{t("setup.jobs")}</h3>

      <div className="flex flex-col items-start gap-5">
        <SetupJobsList onEdit={onEdit} />
      </div>

      <div>
        <button className="btn btn-sm btn-primary" onClick={onCreate}>
          {t("setup.create")} {t("setup.job")}
        </button>
      </div>
    </div>
  );
};

export default SetupJobs;
