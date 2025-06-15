"use client";

import React, { useEffect, useState } from "react";
import { getAllJobs } from "@/lib/server/actions";
import { FaAngleRight, FaHourglassHalf } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

// Define a Job interface
interface Job {
  id: string;
  title: string;
  active: boolean;
  deadline: string;
}

interface SetupJobsListProps {
  onEdit: (job: Job) => void;
}

const SetupJobsList = ({ onEdit }: SetupJobsListProps) => {
  const { t } = useTranslation();

  const [jobs, setJobs] = useState<Job[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const { requests } = await getAllJobs();
        setJobs(requests);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center gap-3 items-center w-full">
        <span className="loading loading-spinner loading-md h-24"></span>
        {t("loading_jobs")}
      </div>
    );
  }

  return (
    <ul className="list bg-base-200 rounded-box w-full">
      {jobs.map((job) => (
        <li
          key={job.id}
          className="list-row flex justify-between items-center p-4 w-full"
        >
          <div className="flex flex-col gap-1">
            <h3 className="font-bold">{job.title}</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="inline-grid *:[grid-area:1/1]">
                  <div
                    className={`status ${
                      job.active ? "status-primary" : "status-error"
                    } animate-ping`}
                  ></div>
                  <div
                    className={`status ${
                      job.active ? "status-primary" : "status-error"
                    }`}
                  ></div>
                </div>
                <span className="text-xs">
                  {job.active
                    ? t("jobsDetails.active")
                    : t("jobsDetails.inactive")}
                </span>
              </div>
              <span className="text-xs text-zinc-300 flex items-center gap-1">
                <FaHourglassHalf size={11} className="text-primary" />
                {new Date(job.deadline).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div>
            <button className="btn btn-sm" onClick={() => onEdit(job)}>
              <span className="md:flex hidden">{t("jobsDetails.details")}</span>
              <FaAngleRight />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SetupJobsList;
