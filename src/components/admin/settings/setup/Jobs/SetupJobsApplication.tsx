"use client";

import React from "react";
import {
  FaAngleLeft,
  FaArrowUpRightFromSquare,
  FaCircleCheck,
  FaCircleXmark,
} from "react-icons/fa6";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import SetupJobsApplicationActions from "./SetupJobsApplicationActions";

interface Application {
  id: string;
  name?: string;
  mobile?: string;
  mail?: string;
  consent?: boolean;
  created_at?: string;
  cvSignedUrl?: string;
  applicationSignedUrl?: string;
}

interface SetupJobsApplicationProps {
  application: Application;
  onBackToDetails: () => void;
  onDeleteSuccess: () => void;
}

const SetupJobsApplication = ({
  application,
  onBackToDetails,
  onDeleteSuccess,
}: SetupJobsApplicationProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="flex flex-row items-center justify-between">
        <button onClick={onBackToDetails} className="btn btn-ghost">
          <FaAngleLeft />
          {t("setup.job_details")}
        </button>
        <SetupJobsApplicationActions
          applicationId={application.id}
          onDeleteSuccess={onDeleteSuccess}
        />
      </div>

      <div className="flex flex-col gap-10">
        <h1 className="text-xl font-semibold">
          {application.name || t("setup.unknown")}
        </h1>

        <div className="flex flex-row gap-10 lg:gap-0">
          <div className="flex flex-col gap-2 w-full lg:w-1/2 2xl:w-1/3">
            <p className="text-xs font-medium text-gray-400">
              {t("setup.mobile")}
            </p>
            <span className="font-semibold">
              {application.mobile || t("setup.unknown")}
            </span>
          </div>

          <div className="flex flex-col gap-2 w-full lg:w-1/2 2xl:w-1/3">
            <p className="text-xs font-medium text-gray-400">
              {t("setup.email")}
            </p>
            <span className="font-semibold">
              {application.mail || t("setup.unknown")}
            </span>
          </div>
        </div>

        <div className="flex flex-row gap-10 lg:gap-0">
          <div className="flex flex-col gap-2 w-full lg:w-1/2 2xl:w-1/3">
            <p className="text-xs font-medium text-gray-400">
              {t("setup.consent_status")}
            </p>
            <span className="font-semibold">
              {application.consent ? (
                <span className="text-primary flex items-center gap-2">
                  <FaCircleCheck /> {t("setup.consent_given")}
                </span>
              ) : (
                <span className="text-error flex items-center gap-2">
                  <FaCircleXmark /> {t("setup.consent_missing")}
                </span>
              )}
            </span>
          </div>

          <div className="flex flex-col gap-2 w-full lg:w-1/2 2xl:w-1/3">
            <p className="text-xs font-medium text-gray-400">
              {t("setup.creation_date")}
            </p>
            <span className="font-semibold">
              {application.created_at
                ? format(
                    new Date(application.created_at),
                    "dd. MMMM yyyy - HH:mm"
                  )
                : t("setup.unknown")}
            </span>
          </div>
        </div>

        <div className="flex gap-5 flex-col">
          <p className="text-xs font-medium text-gray-400">
            {t("setup.cv_and_application")}
          </p>

          {application.cvSignedUrl && (
            <div className="flex flex-col gap-2 items-start">
              <a
                href={application.cvSignedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                {t("setup.view_cv")} <FaArrowUpRightFromSquare />
              </a>
            </div>
          )}

          {application.applicationSignedUrl && (
            <div className="flex flex-col gap-2 items-start">
              <a
                href={application.applicationSignedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                {t("setup.view_application")} <FaArrowUpRightFromSquare />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupJobsApplication;
