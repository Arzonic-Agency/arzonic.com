"use client";

import React, { useState, FormEvent } from "react";
import { createApplication } from "@/lib/client/actions";
import ConsentModal from "../modal/ConsentModal";
import { useTranslation } from "react-i18next";
import { FaCheckCircle } from "react-icons/fa";

type JobsApplyFormProps = {
  job_id: string;
  slug: string;
  title: string;
};

const JobsApplyForm = ({ title, job_id, slug }: JobsApplyFormProps) => {
  const { t, i18n } = useTranslation();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [mail, setMail] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [application, setApplication] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");
  const [cvError, setCvError] = useState("");
  const [applicationError, setApplicationError] = useState("");

  const validatePhoneNumber = (phoneNumber: string) =>
    /^(?:\+45\d{8}|\d{8})$/.test(phoneNumber);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleFileChange = (
    file: File | null,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setError: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (file && file.type !== "application/pdf") {
      setError(t("applyJobForm.errors.invalidFileType"));
      setFile(null);
    } else {
      setError("");
      setFile(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validatePhoneNumber(mobile)) {
      setErrorText(t("applyJobForm.errors.invalidPhone"));
      return;
    }
    if (!validateEmail(mail)) {
      setErrorText(t("applyJobForm.errors.invalidEmail"));
      return;
    }
    if (!consent) {
      setErrorText(t("applyJobForm.errors.consentRequired"));
      return;
    }
    if (!cv || !application) {
      setErrorText(t("applyJobForm.errors.missingFiles"));
      return;
    }

    setIsLoading(true);
    setErrorText("");
    setSuccessText("");

    const result = await createApplication({
      job_id,
      name,
      mobile,
      mail,
      consent,
      slug,
      cv,
      application,
    });

    if (!result.success) {
      const knownErrors = {
        "mail-already-applied": t("applyJobForm.errors.alreadyAppliedMail"),
        "mobile-already-applied": t("applyJobForm.errors.alreadyAppliedMobile"),
        "CV upload failed": t("applyJobForm.errors.generic"),
        "Application upload failed": t("applyJobForm.errors.generic"),
        generic: t("applyJobForm.errors.generic"),
      };

      setErrorText(
        knownErrors[result.message as keyof typeof knownErrors] ||
          result.message ||
          t("applyJobForm.errors.generic")
      );
      setIsLoading(false);
      return;
    }

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, mail, title, lang: i18n.language }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      setErrorText(error || t("applyJobForm.errors.generic"));
      setIsLoading(false);
      return;
    }

    setIsSuccess(true);
    setSuccessText(t("applyJobForm.success.requestSent"));
    setIsLoading(false);
  };

  const handleClose = () => {
    window.location.href = `/jobs/${slug}`;
  };

  return (
    <div className="md:max-w-2xl max-w-md w-full">
      {isSuccess ? (
        <div className="flex flex-col gap-4 bg-base-100 p-10 h-[600px] text-center items-center md:mt-10">
          <span className="text-5xl text-secondary">
            <FaCheckCircle />
          </span>
          <h2 className="text-xl font-bold">
            {t("applyJobForm.success.title")}
          </h2>
          <p>{t("applyJobForm.success.message")}</p>
          <div>
            <button onClick={handleClose} className="btn btn-primary mt-5">
              {t("applyJobForm.success.closeButton")}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <h3 className="text-base text-center text-neutral-400 mb-4">
            {t("applyJobForm.subtitle")}
          </h3>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 bg-base-100"
          >
            <div className="flex flex-col md:flex-row gap-3 md:gap-10">
              <div className="flex-1 flex flex-col gap-3">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    {t("applyJobForm.fields.name.label")}
                  </legend>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder={t("applyJobForm.fields.name.placeholder")}
                    aria-label={t("applyJobForm.aria.nameInput")}
                    className="input input-ghost bg-base-200 w-full md:max-w-xs"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    {t("applyJobForm.fields.email.label")}
                  </legend>
                  <input
                    id="mail"
                    type="email"
                    autoComplete="email"
                    placeholder={t("applyJobForm.fields.email.placeholder")}
                    aria-label={t("applyJobForm.aria.emailInput")}
                    className="input input-ghost bg-base-200 w-full md:max-w-xs"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    required
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    {t("applyJobForm.fields.phone.label")}
                  </legend>
                  <input
                    id="mobile"
                    type="tel"
                    autoComplete="tel"
                    placeholder={t("applyJobForm.fields.phone.placeholder")}
                    aria-label={t("applyJobForm.aria.phoneInput")}
                    className="input input-ghost bg-base-200 w-full md:max-w-xs"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                  />
                </fieldset>
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    {t("applyJobForm.fields.cv.label")}
                  </legend>
                  <input
                    id="cv"
                    type="file"
                    accept=".pdf"
                    aria-label={t("applyJobForm.aria.cvInput")}
                    className="file-input input-ghost bg-base-200 w-full md:max-w-xs"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleFileChange(file, setCv, setCvError);
                    }}
                    required
                  />
                  {cvError && <label className="label">{cvError}</label>}
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    {t("applyJobForm.fields.application.label")}
                  </legend>
                  <input
                    id="application"
                    type="file"
                    accept=".pdf"
                    aria-label={t("applyJobForm.aria.applicationInput")}
                    className="file-input input-ghost bg-base-200 w-full md:max-w-xs"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleFileChange(
                        file,
                        setApplication,
                        setApplicationError
                      );
                    }}
                    required
                  />
                  {applicationError && (
                    <label className="label">{applicationError}</label>
                  )}
                </fieldset>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="consent"
                type="checkbox"
                className="checkbox checkbox-md checkbox-primary"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                aria-label={t("applyJobForm.aria.consentCheckbox")}
                required
              />
              <label htmlFor="consent" className="label-text text-xs max-w-60">
                {t("applyJobForm.fields.consent.label")}{" "}
                <ConsentModal
                  buttonText={t("applyJobForm.fields.consent.readMore")}
                  variant="primary"
                />
              </label>
            </div>

            {errorText && <p className="text-error">{errorText}</p>}
            {successText && <p className="text-success">{successText}</p>}
            <div>
              <button
                type="submit"
                className="btn btn-primary mt-5"
                disabled={isLoading}
                aria-label={t("applyJobForm.aria.submitButton")}
              >
                {isLoading
                  ? t("applyJobForm.buttons.sending")
                  : t("applyJobForm.buttons.submit")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default JobsApplyForm;
