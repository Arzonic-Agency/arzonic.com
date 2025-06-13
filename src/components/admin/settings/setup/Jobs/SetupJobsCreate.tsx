"use client";

import React, { useEffect, useState } from "react";
import TiptapEditor from "@/components/elements/TipTapEditor";
import { createJob, getJobEnums } from "@/lib/server/actions";
import { useTranslation } from "react-i18next";
import { FaAngleLeft } from "react-icons/fa";

const SetupJobsCreate = ({
  onSave,
  onBack,
}: {
  onSave: () => void;
  onBack: () => void;
}) => {
  const { t } = useTranslation();

  const [jobType, setJobType] = useState<string[]>([]);
  const [jobStartType, setJobStartType] = useState<string[]>([]);
  const [jobWorkplace, setJobWorkplace] = useState<string[]>([]);
  const [enumLoading, setEnumLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("");
  const [workplace, setWorklace] = useState("");
  const [startType, setStartType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [errors, setErrors] = useState({
    title: "",
    subtitle: "",
    desc: "",
    type: "",
    workplace: "",
    deadline: "",
    start: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadEnums = async () => {
      try {
        const enums = await getJobEnums();
        setJobType(enums.jobType.map((e: { value: string }) => e.value));
        setJobStartType(
          enums.jobStartType.map((e: { value: string }) => e.value)
        );
        setJobWorkplace(
          enums.jobWorkplace.map((e: { value: string }) => e.value)
        );
      } catch (err) {
        console.error("Failed to load job enums", err);
      } finally {
        setEnumLoading(false);
      }
    };
    loadEnums();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isStartTimeValid = !!startType || !!startDate;

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
        title: !title ? t("createJob.errors.title") : "",
        subtitle: !subtitle ? t("createJob.errors.subtitle") : "",
        desc: !desc ? t("createJob.errors.desc") : "",
        type: !type ? t("createJob.errors.type") : "",
        workplace: !workplace ? t("createJob.errors.workplace") : "",
        deadline: !deadline ? t("createJob.errors.deadline") : "",
        start: !isStartTimeValid ? t("createJob.errors.start") : "",
      });
      setLoading(false);
      return;
    }

    try {
      await createJob({
        title,
        subtitle,
        desc,
        type,
        workplace,
        start_type: startType || null,
        start_date: startDate || null,
        deadline,
      });
      onSave();
    } catch (error) {
      console.error("Failed to create job:", error);
      alert(t("createJob.createError"));
    } finally {
      setLoading(false);
    }
  };

  if (enumLoading) return <p>{t("createJob.loading")}</p>;

  return (
    <div className="flex flex-col gap-3 w-full p-3 pt-5">
      <div className="mb-5">
        <button onClick={onBack} className="btn btn-ghost">
          <FaAngleLeft />
          {t("setup.back")}
        </button>
      </div>

      <span className="text-lg font-bold">{t("createJob.formTitle")}</span>

      <form onSubmit={handleSave} className="flex flex-col gap-5 w-full">
        <div className="flex flex-col lg:flex-row gap-5 w-full">
          <div className="flex flex-col gap-5 w-full">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                {t("createJob.title")}
              </legend>
              <input
                type="text"
                className="input input-bordered input-md"
                placeholder={t("createJob.placeholders.title")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && (
                <span className="text-xs text-red-500">{errors.title}</span>
              )}
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                {t("createJob.subtitle")}
              </legend>
              <input
                type="text"
                className="input input-bordered input-md"
                placeholder={t("createJob.placeholders.subtitle")}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
              {errors.subtitle && (
                <span className="text-xs text-red-500">{errors.subtitle}</span>
              )}
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                {t("createJob.jobType")}
              </legend>
              <select
                className="select select-bordered"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="" disabled>
                  {t("createJob.jobType")}
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
                {t("createJob.deadline")}
              </legend>
              <input
                type="date"
                className="input input-bordered input-md"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
              {errors.deadline && (
                <span className="text-xs text-red-500">{errors.deadline}</span>
              )}
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                {t("createJob.workplace")}
              </legend>
              <select
                className="select select-bordered"
                value={workplace}
                onChange={(e) => setWorklace(e.target.value)}
              >
                <option value="" disabled>
                  {t("createJob.workplace")}
                </option>
                {jobWorkplace.map((val, index) => (
                  <option key={index} value={val}>
                    {val}
                  </option>
                ))}
              </select>
              {errors.workplace && (
                <span className="text-xs text-red-500">{errors.workplace}</span>
              )}
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                {t("createJob.startType")}
              </legend>
              <div className="flex flex-row justify-between gap-2 max-w-xs">
                <input
                  type="date"
                  className="input input-bordered max-w-[150px]"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setStartType("");
                  }}
                />
                <div className="flex flex-col gap-1">
                  {jobStartType.map((val, index) => (
                    <label
                      key={index}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary checkbox-sm"
                        value={val}
                        checked={startType === val}
                        onChange={() => {
                          setStartType(val);
                          setStartDate("");
                        }}
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
            {t("createJob.description")}
          </legend>
          <TiptapEditor value={desc} onChange={setDesc} />
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
            {loading ? t("createJob.creating") : t("createJob.create")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetupJobsCreate;
