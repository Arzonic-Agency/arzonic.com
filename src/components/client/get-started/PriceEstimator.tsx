"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getEstimatorQuestions, EstimatorQuestion } from "@/lib/server/actions";
import { FaAngleLeft, FaAngleDown } from "react-icons/fa6";
import ConsentModal from "../modal/ConsentModal";
import { useTranslation } from "react-i18next";

type Country = { name: string; code: string; dial: string; flag: string; };
type RestCountry = { cca2: string; name: { common: string }; idd?: { root?: string; suffixes?: string[] } };

const QUESTIONS_PER_SLIDE = 1;
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

const PriceEstimator = () => {
  const { t } = useTranslation();
  const [questionsState, setQuestionsState] = useState<EstimatorQuestion[]>([]);
  useEffect(() => {
    const raw = localStorage.getItem("i18nextLng") || "en";
    const lang = raw.split("-")[0] === "da" ? "da" : "en";
    getEstimatorQuestions(lang)
      .then(setQuestionsState)
      .catch((err) => console.error("Error loading questions:", err));
  }, []);

  const slides = Math.ceil(questionsState.length / QUESTIONS_PER_SLIDE);
  const [step, setStep] = useState(-1); // -1 = intro
  const [direction, setDirection] = useState(0);
  const [groupSel, setGroupSel] = useState<number[][]>([]);
  const [answers, setAnswers] = useState<number[][]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [phonePrefix, setPhonePrefix] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [packageLabel, setPackageLabel] = useState("");

  // fetch package label on final slide
  useEffect(() => {
    const pkgOptId = answers[1]?.[0];
    if (step === slides && pkgOptId) {
      fetch("/api/package-label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId: pkgOptId }),
      })
        .then((r) => r.json())
        .then(({ label }) => setPackageLabel(label || ""))
        .catch((e) => console.error("Failed to load package label", e));
    }
  }, [step, slides, answers]);

  // fetch + sort countries
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((r) => r.json())
      .then((data: RestCountry[]) => {
        const list = data
          .map((c) => {
            const root = c.idd?.root || "";
            const suffix = c.idd?.suffixes?.[0] || "";
            const dial = suffix ? `${root}${suffix}` : root;
            if (!dial) return null;
            const code = c.cca2;
            const name = c.name.common;
            const flag = code
              .toUpperCase()
              .replace(/./g, (ch) =>
                String.fromCodePoint(0x1f1e6 + ch.charCodeAt(0) - 65)
              );
            return { name, code, dial, flag };
          })
          .filter((c): c is Country => !!c)
          .sort((a, b) => a.name.localeCompare(b.name));
        const region = navigator.language.split("-")[1]?.toUpperCase() || "";
        const match = list.find((c) => c.code === region) ?? list[0];
        setCountries(list);
        setPhonePrefix(match.dial);
      })
      .catch((e) => console.error("Failed to load countries", e));
  }, []);

  // current questions for this slide
  const startIdx = step * QUESTIONS_PER_SLIDE;
  const currentQs =
    step >= 0 && step < slides
      ? questionsState.slice(startIdx, startIdx + QUESTIONS_PER_SLIDE)
      : [];

  // restore previous selections when step changes
  useEffect(() => {
    if (step >= 0 && step < slides) {
      const saved = answers[step] || [];
      setGroupSel([saved]);
    }
  }, [step, answers]);

  const toggleOption = (qIdx: number, optId: number) => {
    setGroupSel((prev) => {
      const next = [...prev];
      const single = currentQs[qIdx].type === "single";
      if (single) {
        next[qIdx] = [optId];
      } else {
        const sel = next[qIdx] || [];
        next[qIdx] = sel.includes(optId)
          ? sel.filter((i) => i !== optId)
          : [...sel, optId];
      }
      return next;
    });
  };

  const goNext = () => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = groupSel[0];
      return next;
    });
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    if (step === 0) {
      setStep(-1);
      setAnswers([]);
    } else {
      setStep((s) => s - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = questionsState.map((q, i) => ({
      questionId: q.id,
      optionIds: answers[i] || [],
    }));

    const details = questionsState
      .map((q, i) => `${q.text}: ${answers[i]?.join(", ")}`)
      .join("\n");

    const selectedCountry =
      countries.find((c) => c.dial === phonePrefix)?.code ?? "";
    const fullPhone = `${phonePrefix}${phoneNumber}`;

    // read the current site-lang from i18next
    const rawLang = localStorage.getItem("i18nextLng") || "en";
    const lang = rawLang.split("-")[0] === "da" ? "da" : "en";

    try {
      const res = await fetch("/api/estimator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          country: selectedCountry,
          phone: fullPhone,
          details,
          answers: payload,
          lang,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Estimate request failed");

      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setError(err.message);
      } else {
        console.error("Unknown error during submission", err);
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        {/* Intro */}
        {step === -1 && !success && (
          <motion.div
            key="intro"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
            transition={{ duration: 0.4 }}
            className=" p-7 rounded-2xl shadow-lg flex flex-col justify-center gap-6 text-center h-[550px]"
          >
            <h2 className="text-2xl font-bold">
              {t("intro.title", "Let’s find your price")}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t(
                "intro.subtitle",
                "4 simple questions. 1 minute. A clear estimate for your project – 100% non-binding."
              )}
            </p>
            <button onClick={goNext} className="btn btn-primary w-full mt-4">
              {t("intro.startButton", "Start the estimate")}
            </button>
          </motion.div>
        )}

        {/* Question Slides */}
        {step >= 0 && step < slides && (
          <motion.div
            key={`slide-${step}`}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
            transition={{ duration: 0.4 }}
            className=" p-7 rounded-2xl shadow-lg flex flex-col gap-7"
          >
            {currentQs.map((q, idx) => (
              <div key={q.id} className="flex flex-col gap-5">
                <h2 className="text-lg md:text-xl font-bold">{q.text}</h2>
                <div className="flex flex-col gap-3 mb-5">
                  {q.options.map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type={q.type === "single" ? "radio" : "checkbox"}
                        checked={groupSel[idx]?.includes(opt.id) ?? false}
                        onChange={() => toggleOption(idx, opt.id)}
                        className={
                          q.type === "single"
                            ? "radio radio-primary"
                            : "checkbox checkbox-primary"
                        }
                      />
                      <span>{opt.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex gap-3">
              <button onClick={goBack} className="btn btn-outline">
                <FaAngleLeft />
              </button>
              <button
                onClick={goNext}
                disabled={!groupSel.every((sel) => sel.length > 0)}
                className="btn btn-primary flex-1"
              >
                {t("form.nextButton", "Next")}
              </button>
            </div>
          </motion.div>
        )}

        {/* Final Form */}
        {step === slides && !success && (
          <>
            {/* Display the fetched package label above the form */}
            {packageLabel && (
              <div className="mb-4 text-center">
                <h3 className="text-xl font-semibold">{packageLabel}</h3>
              </div>
            )}

            <motion.form
              key="form"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              custom={direction}
              transition={{ duration: 0.4 }}
              onSubmit={handleSubmit}
              className="p-7 rounded-2xl shadow-lg flex flex-col gap-4"
            >
              <h2 className="text-2xl font-bold text-center">
                {t("form.title", "Almost done!")}
              </h2>
              {error && <p className="text-red-500 text-center">{error}</p>}

              <input
                type="text"
                placeholder={t("form.namePlaceholder", "Your name")}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full"
              />

              <input
                type="email"
                placeholder={t("form.emailPlaceholder", "Your email")}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full"
              />

              <div className="flex gap-2 items-center">
                <div className="dropdown">
                  <label
                    tabIndex={0}
                    className="btn btn-outline w-28 justify-between flex items-center"
                  >
                    {(() => {
                      const sel = countries.find(
                        (c) => c.dial === phonePrefix
                      );
                      return (
                        <>
                          {sel?.flag} {sel?.dial}
                        </>
                      );
                    })()}
                    <FaAngleDown className="ml-2" />
                  </label>
                  <ul
                    tabIndex={0}
                    className="
                      dropdown-content
                      p-1
                      shadow
                      bg-base-100
                      rounded-box
                      w-56
                      max-h-60
                      overflow-y-auto
                      flex
                      flex-col
                      z-50
                    "
                  >
                    {countries.map((cn) => (
                      <li key={cn.code}>
                        <button
                          onClick={() => setPhonePrefix(cn.dial)}
                          className="flex items-center justify-between px-2 py-1 hover:bg-base-200 rounded"
                        >
                          <span className="flex-1 mr-2 whitespace-nowrap overflow-hidden overflow-ellipsis">
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
                  placeholder={t("form.phonePlaceholder", "Phone number")}
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="input input-bordered flex-1"
                />
              </div>

              {/* Consent */}
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
                  {t("consent.agree", "I agree to the")}{" "}
                  <ConsentModal
                    buttonText={t("consent.privacyPolicy", "Privacy Policy")}
                    variant="hover"
                  />{" "}
                  {t("consent.and", "and data processing.")}
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={goBack}
                  type="button"
                  className="btn btn-outline"
                >
                  <FaAngleLeft />
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary flex-1 ${loading ? "loading" : ""
                    }`}
                  disabled={loading || !consentChecked}
                >
                  {t("form.submitButton", "Submit")}
                </button>
              </div>
            </motion.form>
          </>
        )}

        {/* Thank You */}
        {success && (
          <motion.div
            key="thanks"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
            transition={{ duration: 0.4 }}
            className=" p-6 rounded-2xl shadow-lg text-center"
          >
            <h2 className="text-2xl font-bold mb-4">
              {t("thanks.title", "Thank you!")}
            </h2>
            <p>{t("thanks.message", "We’ve received your request and will get back to you soon.")}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PriceEstimator;
