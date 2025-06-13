"use client";

import React, { useEffect, useState } from "react";
import SetupJobsDetailsActions from "./SetupJobsDetailsActions";
import SetupJobsEdit from "./SetupJobsEdit";
import SetupJobsApplication from "./SetupJobsApplication";
import { getJobById, getApplicationsByJobId } from "@/lib/server/actions";
import { FaAngleRight, FaCircleUser, FaAngleLeft } from "react-icons/fa6";
import { format } from "date-fns";
import { da, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";

interface Job {
  id: string;
  title: string;
  created_at: string;
  type: string;
  workplace: string;
  deadline: string;
  start_date?: string;
  start_type?: string;
  active: boolean;
}

interface Application {
  id: string;
  name: string;
  created_at: string;
}

interface SetupJobsDetailsProps {
  jobId: string;
  onBack: () => void;
  onDelete: () => void;
}

const SetupJobsDetails = ({
  jobId,
  onBack,
  onDelete,
}: SetupJobsDetailsProps) => {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language === "da" ? da : enUS;

  const [isEditing, setIsEditing] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [updateToast, setUpdateToast] = useState(false);

  useEffect(() => {
    async function fetchJobAndApplications() {
      try {
        const [jobData, applicationsData] = await Promise.all([
          getJobById(jobId),
          getApplicationsByJobId(jobId),
        ]);
        setJob(jobData);
        setApplications(applicationsData);
      } catch (error) {
        console.error("Failed to load job or applications:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobAndApplications();
  }, [jobId]);

  const handleApplicationDelete = (deletedApplicationId: string) => {
    setApplications((prev) =>
      prev.filter((app) => app.id !== deletedApplicationId)
    );
    setSelectedApplication(null);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSave = (updatedJob: Job) => {
    setJob(updatedJob);
    setUpdateToast(true);
    setTimeout(() => setUpdateToast(false), 3000);
  };

  if (loading) {
    return (
      <div className="w-full h-52 flex items-center justify-center gap-2">
        <span className="loading loading-spinner loading-md h-40" />
        {t("jobsDetails.loading")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 w-full">
      {isEditing ? (
        <SetupJobsEdit
          jobId={jobId}
          onSave={(jobData) => {
            const updatedJob: Job = {
              ...job,
              ...jobData,
            } as Job;
            handleSave(updatedJob);
          }}
          onBackToDetails={() => setIsEditing(false)}
        />
      ) : selectedApplication ? (
        <SetupJobsApplication
          application={selectedApplication}
          onBackToDetails={() => setSelectedApplication(null)}
          onDeleteSuccess={() =>
            handleApplicationDelete(selectedApplication.id)
          }
        />
      ) : (
        <div className="flex flex-col gap-10">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="btn btn-ghost">
              <FaAngleLeft />
              {t("jobsDetails.back")}
            </button>
            <SetupJobsDetailsActions
              onEdit={() => setIsEditing(true)}
              jobId={jobId}
              active={job.active}
              onDelete={onDelete}
            />
          </div>

          <h1 className="text-xl font-semibold">{t("jobsDetails.title")}</h1>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-0">
            <div className="flex flex-col gap-2 w-full lg:w-1/2 2xl:w-1/3">
              <p className="text-xs font-medium text-gray-400">
                {t("jobsDetails.fields.title")}
              </p>
              <span className="font-semibold">
                {job.title || t("jobsDetails.fields.unknown")}
              </span>
            </div>
            <div className="flex flex-col gap-2 w-full lg:w-1/2 2xl:w-1/3">
              <p className="text-xs font-medium text-gray-400">
                {t("jobsDetails.fields.createdAt")}
              </p>
              <span className="font-semibold">
                {job.created_at
                  ? format(new Date(job.created_at), "dd. MMMM yyyy - HH:mm", {
                      locale: currentLocale,
                    })
                  : t("jobsDetails.fields.unknown")}
              </span>
            </div>
          </div>

          <div className="flex flex-row gap-10 md:gap-0">
            <div className="flex flex-col gap-2 w-full md:w-1/2 2xl:w-1/3">
              <p className="text-xs font-medium text-gray-400">
                {t("jobsDetails.fields.type")}
              </p>
              <span className="font-semibold">
                {job.type || t("jobsDetails.fields.unknown")}
              </span>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-1/2 2xl:w-1/3">
              <p className="text-xs font-medium text-gray-400">
                {t("jobsDetails.fields.workplace")}
              </p>
              <span className="font-semibold">
                {job.workplace || t("jobsDetails.fields.unknown")}
              </span>
            </div>
          </div>

          <div className="flex flex-row gap-10 md:gap-0">
            <div className="flex flex-col gap-2 w-full md:w-1/2 2xl:w-1/3">
              <p className="text-xs font-medium text-gray-400">
                {t("jobsDetails.fields.deadline")}
              </p>
              <span className="font-semibold">
                {job.deadline
                  ? format(new Date(job.deadline), "dd. MMMM yyyy", {
                      locale: currentLocale,
                    })
                  : t("jobsDetails.fields.unknown")}
              </span>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-1/2 2xl:w-1/3">
              <p className="text-xs font-medium text-gray-400">
                {t("jobsDetails.fields.startDate")}
              </p>
              <span className="font-semibold">
                {job.start_date ||
                  job.start_type ||
                  t("jobsDetails.fields.unknown")}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <span className="text-xs font-medium text-gray-400">
              {t("jobsDetails.applications.title")}
            </span>
            <ul className="list w-full">
              {applications.length > 0 ? (
                applications.map((application) => (
                  <li
                    key={application.id}
                    className="list-row items-center"
                    onClick={() => setSelectedApplication(application)}
                  >
                    <div className="flex items-center justify-center text-4xl text-zinc-500">
                      <FaCircleUser />
                    </div>
                    <div>
                      <div>
                        {application.name || t("jobsDetails.fields.unknown")}
                      </div>
                      <div className="text-xs font-semibold text-zinc-500">
                        {format(
                          new Date(application.created_at),
                          "dd. MMMM yyyy - HH:mm",
                          { locale: currentLocale }
                        )}
                      </div>
                    </div>
                    <button className="btn btn-square">
                      <FaAngleRight />
                    </button>
                  </li>
                ))
              ) : (
                <li className="list-row items-center">
                  <p className="text-sm text-gray-500">
                    {t("jobsDetails.applications.noApplications")}
                  </p>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {(showToast || updateToast) && (
        <div className="toast bottom-20 md:bottom-0 toast-end">
          <div className="alert alert-success text-neutral-content">
            <span className="text-base md:text-lg">
              {showToast
                ? t("jobsDetails.deleted_application")
                : t("jobsDetails.updated_job")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupJobsDetails;
