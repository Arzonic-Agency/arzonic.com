"use client";

import React from "react";
import { FaAngleLeft } from "react-icons/fa6";
import ConsentModal from "../modal/ConsentModal";
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
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input input-ghost bg-base-200 w-full max-w-md"
      />

      <input
        type="email"
        placeholder={t("estimator.form.emailPlaceholder", "Your email")}
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input input-ghost bg-base-200 w-full max-w-md"
      />

      <div className="flex gap-2 items-center max-w-md">
        <div className="dropdown">
          <label
            tabIndex={0}
            className="btn btn-ghost bg-base-200 w-28 justify-between flex items-center"
          >
            {(() => {
              const sel = countries.find((c) => c.dial === phonePrefix);
              return (
                <>
                  {sel?.flag} {sel?.dial}
                </>
              );
            })()}
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content p-1 shadow bg-base-100 rounded-box w-56 max-h-60 overflow-y-auto flex flex-col z-50"
          >
            {countries.map((cn) => (
              <li key={cn.code}>
                <button
                  onClick={() => setPhonePrefix(cn.dial)}
                  className="flex items-center justify-between px-2 py-1 hover:bg-base-200 rounded"
                >
                  <span className="flex-1 mr-2">
                    {cn.flag} {cn.name}
                  </span>
                  <span className="opacity-70">{cn.dial}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <input
          type="tel"
          placeholder={t("estimator.form.phonePlaceholder", "Phone number")}
          required
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="input input-ghost bg-base-200 w-full max-w-md"
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
            variant="hover"
          />{" "}
          {t("estimator.consent.and", "and data processing.")}
        </label>
      </div>

      <div className="flex items-center gap-10">
        <button onClick={onBack} type="button" className="btn btn-sm btn-soft">
          <FaAngleLeft />
        </button>
        <button
          type="submit"
          className={`btn btn-primary flex-initial w-60 ${
            loading ? "loading" : ""
          }`}
          disabled={loading || !consentChecked}
        >
          {t("estimator.form.submitButton", "Submit")}
        </button>
      </div>
    </form>
  );
};

export default EstimatorContactForm;
