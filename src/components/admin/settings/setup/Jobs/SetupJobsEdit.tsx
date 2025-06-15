"use client";

import React, { useEffect, useState } from "react";
import TiptapEditor from "@/components/elements/TipTapEditor";
import { getJobById, updateJob, getJobEnums } from "@/lib/server/actions";
import { FaAngleLeft } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

interface JobData {
  title: string;
  subtitle: string;
  desc: string;
  type: string;
  workplace: string;
  start_type?: string;
  start_date?: string;
  deadline: string;
}

interface SetupJobsEditProps {
  jobId: string;
  onSave: (jobData: JobData) => void;
  onBackToDetails: () => void;
}

const SetupJobsEdit = ({
  jobId,
  onSave,
  onBackToDetails,
}: SetupJobsEditProps) => {
  const { t } = useTranslation();

  const [jobType, setJobType] = useState<string[]>([]);
  const [jobStartType, setJobStartType] = useState<string[]>([]);
  const [jobWorkplace, setJobWorkplace] = useState<string[]>([]);
  const [enumLoading, setEnumLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [jobData, setJobData] = useState<JobData>({
    title: "",
    subtitle: "",
    desc: "",
    type: "",
    workplace: "",
    start_type: "",
    start_date: "",
    deadline: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    subtitle: "",
    desc: "",
    type: "",
    workplace: "",
    deadline: "",
    start: "",
  });

  useEffect(() => {
    const loadEnumsAndJob = async () => {
      try {
        const enums = await getJobEnums();
        setJobType(enums.jobType.map((e: { value: string }) => e.value));
        setJobStartType(
          enums.jobStartType.map((e: { value: string }) => e.value)
        );
        setJobWorkplace(
          enums.jobWorkplace.map((e: { value: string }) => e.value)
        );

        const job = await getJobById(jobId);
        setJobData(job);
      } catch (err) {
        console.error("Failed to load job enums or job data", err);
      } finally {
        setEnumLoading(false);
      }
    };
    loadEnumsAndJob();
  }, [jobId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      title,
      subtitle,
      desc,
      type,
      workplace,
      deadline,
      start_type,
      start_date,
    } = jobData;

    const isStartTimeValid = !!start_type || !!start_date;

    if (
      !title ||
      !subtitle ||
      !desc ||
      !type ||
      !workplace ||
      !deadline ||
      !isStartTimeValid
    ) {
      setErrors({
        title: !title ? t("updateJob.errors.title") : "",
        subtitle: !subtitle ? t("updateJob.errors.subtitle") : "",
        desc: !desc ? t("updateJob.errors.desc") : "",
        type: !type ? t("updateJob.errors.type") : "",
        workplace: !workplace ? t("updateJob.errors.workplace") : "",
        deadline: !deadline ? t("updateJob.errors.deadline") : "",
        start: !isStartTimeValid ? t("updateJob.errors.start") : "",
      });
      setLoading(false);
      return;
    }

    try {
      onSave(jobData);
      onBackToDetails();
      const updatedJobData = {
        ...jobData,
        start_type: jobData.start_date ? null : jobData.start_type,
        start_date: jobData.start_type ? null : jobData.start_date,
      };

      await updateJob(jobId, updatedJobData);
    } catch (error) {
      console.error("Failed to update job:", error);
      alert("Could not update job.");
    } finally {
      setLoading(false);
    }
  };

  if (enumLoading) {
    return (
      <div className="w-full h-52 flex items-center justify-center gap-2">
        <span className="loading loading-spinner loading-md h-40" />
        {t("updateJob.loading")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 w-full">
      <div>
        <button onClick={onBackToDetails} className="btn btn-ghost">
          <FaAngleLeft /> {t("back")}
        </button>
      </div>
      <div className="flex flex-col gap-5 w-full">
        <span className="text-lg font-bold">{t("updateJob.formTitle")}</span>
        <form onSubmit={handleSave} className="flex flex-col gap-5 w-full">
          <div className="flex flex-col lg:flex-row gap-5 w-full">
            <div className="flex flex-col gap-5 w-full">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  {t("updateJob.title")}
                </legend>
                <input
                  type="text"
                  className="input input-bordered input-md"
                  placeholder={t("updateJob.placeholders.title")}
                  value={jobData.title}
                  onChange={(e) =>
                    setJobData({ ...jobData, title: e.target.value })
                  }
                />
                {errors.title && (
                  <span className="text-xs text-red-500">{errors.title}</span>
                )}
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  {t("updateJob.subtitle")}
                </legend>
                <input
                  type="text"
                  className="input input-bordered input-md"
                  placeholder={t("updateJob.placeholders.subtitle")}
                  value={jobData.subtitle}
                  onChange={(e) =>
                    setJobData({ ...jobData, subtitle: e.target.value })
                  }
                />
                {errors.subtitle && (
                  <span className="text-xs text-red-500">
                    {errors.subtitle}
                  </span>
                )}
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  {t("updateJob.jobType")}
                </legend>
                <select
                  className="select select-bordered"
                  value={jobData.type}
                  onChange={(e) =>
                    setJobData({ ...jobData, type: e.target.value })
                  }
                >
                  <option value="" disabled>
                    {t("updateJob.jobType")}
                  </option>
                  {jobType.map((val, index) => (
                    <option key={index} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <span className="text-xs text-red-500">{errors.type}</span>
                )}
              </fieldset>
            </div>

            <div className="flex flex-col gap-5 w-full">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  {t("updateJob.deadline")}
                </legend>
                <input
                  type="date"
                  className="input input-bordered input-md"
                  value={jobData.deadline}
                  onChange={(e) =>
                    setJobData({ ...jobData, deadline: e.target.value })
                  }
                />
                {errors.deadline && (
                  <span className="text-xs text-red-500">
                    {errors.deadline}
                  </span>
                )}
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  {t("updateJob.workplace")}
                </legend>
                <select
                  className="select select-bordered"
                  value={jobData.workplace}
                  onChange={(e) =>
                    setJobData({ ...jobData, workplace: e.target.value })
                  }
                >
                  <option value="" disabled>
                    {t("updateJob.workplace")}
                  </option>
                  {jobWorkplace.map((val, index) => (
                    <option key={index} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
                {errors.workplace && (
                  <span className="text-xs text-red-500">
                    {errors.workplace}
                  </span>
                )}
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  {t("updateJob.startType")}
                </legend>
                <div className="flex flex-row justify-between gap-2 max-w-xs">
                  <input
                    type="date"
                    className="input input-bordered max-w-[150px]"
                    value={jobData.start_date || ""}
                    onChange={(e) =>
                      setJobData({
                        ...jobData,
                        start_date: e.target.value,
                        start_type: "",
                      })
                    }
                  />
                  <div className="flex flex-col gap-2">
                    {jobStartType.map((val, index) => (
                      <label
                        key={index}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={val}
                          checked={jobData.start_type === val}
                          onChange={() =>
                            setJobData({
                              ...jobData,
                              start_type: val,
                              start_date: "",
                            })
                          }
                        />
                        <span>{val}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {errors.start && (
                  <span className="text-xs text-red-500">{errors.start}</span>
                )}
              </fieldset>
            </div>
          </div>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              {t("updateJob.description")}
            </legend>
            <TiptapEditor
              value={jobData.desc}
              onChange={(value) => setJobData({ ...jobData, desc: value })}
            />
            {errors.desc && (
              <span className="text-xs text-red-500">{errors.desc}</span>
            )}
          </fieldset>

          <div>
            <button
              type="submit"
              className="btn btn-primary mt-2"
              disabled={loading}
            >
              {loading ? t("updateJob.saving") : t("updateJob.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupJobsEdit;
