"use client";

import React from "react";
import { FaAngleLeft } from "react-icons/fa6";
import ConsentModal from "../modal/PolicyModal";
import { useTranslation } from "react-i18next";
import { FaRegCheckCircle } from "react-icons/fa";

type Country = { name: string; code: string; dial: string; flag: string };

type Props = {
  name: string;
  setName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
  phonePrefix: string;
  setPhonePrefix: (val: string) => void;
  countries: Country[];
  consentChecked: boolean;
  setConsentChecked: (val: boolean) => void;
  loading: boolean;
  error: string | null;
  onBack: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const EstimatorContactForm = ({
  name,
  setName,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  phonePrefix,
  setPhonePrefix,
  countries,
  consentChecked,
  setConsentChecked,
  loading,
  error,
  onBack,
  onSubmit,
}: Props) => {
  const { t } = useTranslation();
  return (
    <form onSubmit={onSubmit} className="p-7 flex flex-col gap-5 max-w-md">
      <h2 className="text-base md:text-xl font-bold flex gap-1 items-center">
        <FaRegCheckCircle size={20} />
        {t(
          "estimator.form.title",
          "Your estimate is ready – just one step left!"
        )}{" "}
      </h2>
      <p className="text-sm text-zinc-400">{t("estimator.form.subtitle")}</p>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <input
        type="text"
        placeholder={t("estimator.form.namePlaceholder", "Your name")}
        aria-label={t("aria.estimator.nameInput", "Enter your name")}
        required
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input input-ghost bg-base-300 w-full max-w-md"
      />

      <input
        type="email"
        placeholder={t("estimator.form.emailPlaceholder", "Your email")}
        aria-label={t("aria.estimator.emailInput", "Enter your email")}
        required
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input input-ghost bg-base-300 w-full max-w-md"
      />

      <div className="flex gap-2 items-center max-w-md">
        <div className="relative w-28">
          <div className="btn btn-ghost bg-base-300 w-26 justify-between flex items-center pointer-events-none">
            {(() => {
              const selected = countries.find((c) => c.dial === phonePrefix);
              return (
                <>
                  {selected?.flag} {phonePrefix}
                </>
              );
            })()}
          </div>
          <select
            value={phonePrefix}
            onChange={(e) => setPhonePrefix(e.target.value)}
            className="select select-ghost absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label={t(
              "aria.estimator.countryCodeSelect",
              "Select country code"
            )}
          >
            {countries.map((cn) => (
              <option
                key={cn.code}
                value={cn.dial}
                label={`${cn.flag} ${cn.name} ${cn.dial}`}
              >
                {cn.name}
              </option>
            ))}
          </select>
        </div>
        <input
          type="tel"
          placeholder={t("estimator.form.phonePlaceholder", "Phone number")}
          aria-label={t("aria.estimator.phoneInput", "Enter your phone number")}
          required
          name="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="input input-ghost bg-base-300 w-full max-w-md"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          id="consent"
          type="checkbox"
          className="checkbox checkbox-md checkbox-primary"
          checked={consentChecked}
          onChange={(e) => setConsentChecked(e.target.checked)}
          required
        />
        <label htmlFor="consent" className="label-text text-xs">
          {t("estimator.consent.agree", "I agree to the")}{" "}
          <ConsentModal
            buttonText={t("estimator.consent.privacyPolicy", "Privacy Policy")}
            variant="primary"
          />{" "}
          {t("estimator.consent.and", "and data processing.")}
        </label>
      </div>

      <div className="flex items-center gap-10">
        <button
          onClick={onBack}
          type="button"
          className="btn btn-sm btn-soft"
          aria-label={t(
            "aria.estimator.backButton",
            "Go back to the previous step"
          )}
        >
          <FaAngleLeft />
        </button>
        <button
          type="submit"
          className={`btn btn-primary flex-initial w-60 ${
            loading ? "loading" : ""
          }`}
          disabled={loading || !consentChecked}
          aria-label={t("aria.estimator.submitButton", "Submit the form")}
        >
          {t("estimator.form.submitButton", "Submit")}
        </button>
      </div>
    </form>
  );
};

export default EstimatorContactForm;
