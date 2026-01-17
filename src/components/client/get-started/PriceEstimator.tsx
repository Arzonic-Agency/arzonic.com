"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  type Variants,
  type Easing,
} from "framer-motion";
import { FaAngleLeft } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import EstimatorContactForm from "../forms/EstimatorForm";
import { EstimatorQuestion, getEstimatorQuestions } from "@/lib/client/actions";

type Country = { name: string; code: string; dial: string; flag: string };

const QUESTIONS_PER_SLIDE = 1;
const easeOutTransition: Easing = "easeOut";
const easeInTransition: Easing = "easeIn";
const slideVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: easeOutTransition },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -100 : 100,
    opacity: 0,
    transition: { duration: 0.3, ease: easeInTransition },
  }),
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
  const [step, setStep] = useState(-1);
  const [direction, setDirection] = useState(0);
  const [groupSel, setGroupSel] = useState<number[][]>([]);
  const [answers, setAnswers] = useState<number[][]>([]);
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [phonePrefix, setPhonePrefix] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const totalSlides = Math.ceil(questionsState.length / QUESTIONS_PER_SLIDE);
    const pkgOptId = answers[1]?.[0];
    if (step === totalSlides && pkgOptId) {
      fetch("/api/package-label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId: pkgOptId }),
      })
        .then((r) => r.json())
        .then(({ label }) => console.log(label || ""))
        .catch((e) => console.error("Failed to load package label", e));
    }
  }, [step, answers, questionsState]);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=idd,cca2,name")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP error ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Unexpected API response format");
        }
        const list = data
          .map((c) => {
            if (!c.idd || !c.idd.root || !c.idd.suffixes) return null;
            const root = c.idd.root;
            const suffix = c.idd.suffixes[0] || "";
            const dial = `${root}${suffix}`;
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
        const match =
          list.find((c) => c.code === region) ??
          list.find((c) => c.code === "DK") ??
          list[0];
        setCountries(list);
        setPhonePrefix(match.dial);
      })
      .catch((e) => console.error("Failed to load countries", e));
  }, []);

  const startIdx = step * QUESTIONS_PER_SLIDE;
  const currentQs =
    step >= 0 && step < slides
      ? questionsState.slice(startIdx, startIdx + QUESTIONS_PER_SLIDE)
      : [];

  useEffect(() => {
    const totalSlides = Math.ceil(questionsState.length / QUESTIONS_PER_SLIDE);
    if (step >= 0 && step < totalSlides) {
      const saved = answers[step] || [];
      setGroupSel([saved]);
    }
  }, [step, answers, questionsState]);

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

  const resetEstimator = () => {
    setStep(-1);
    setDirection(0);
    setAnswers([]);
    setGroupSel([]);
    setCompany("");
    setEmail("");
    setPhoneNumber("");
    setPhonePrefix("");
    setConsentChecked(false);
    setSuccess(false);
    setError(null);
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

    if (!consentChecked) {
      setError(
        t("estimator.form.error.consentRequired", "Consent is required.")
      );
      setLoading(false);
      return;
    }

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

    const rawLang = localStorage.getItem("i18nextLng") || "en";
    const lang = rawLang.split("-")[0] === "da" ? "da" : "en";

    try {
      const res = await fetch("/api/estimator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          email,
          country: selectedCountry,
          phone: fullPhone,
          details,
          answers: payload,
          lang,
          consentChecked,
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
    <section className="w-full h-full flex flex-col items-center justify-center">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        {step === -1 && !success && (
          <motion.div
            key="intro"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
            transition={{ duration: 0.4 }}
            className="p-5 md:p-7 rounded-2xl flex flex-col mt-10 md:justify-center items-start gap-6 md:h-[360px]"
          >
            <div className="flex flex-col gap-5 text-center ">
              <h2 className="text-xl font-bold">
                {t("estimator.intro.title")}
              </h2>
              <p className="text-zinc-400">{t("estimator.intro.subtitle")}</p>
              <button onClick={goNext} className="btn btn-primary mt-3 btn-lg">
                {t("estimator.intro.startButton", "Start the estimate")}
              </button>
            </div>
          </motion.div>
        )}

        {step >= 0 && step < slides && (
          <motion.div
            key={`slide-${step}`}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
            transition={{ duration: 0.4 }}
            className="p-0 sm:p-7 flex flex-col mt-10 w-xs md:w-sm md:justify-start gap-7 h-[488px] md:h-[360px]"
          >
            {currentQs.map((q, idx) => (
              <div key={q.id} className="flex flex-col gap-5">
                <h2 className="text-lg md:text-xl font-bold">{q.text}</h2>
                <div className="flex flex-col gap-5 md:gap-3 mb-5">
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
                      <span className="text-base">{opt.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex gap-10 items-center">
              <button onClick={goBack} className="btn btn-sm btn-soft">
                <FaAngleLeft />
              </button>
              <button
                onClick={goNext}
                disabled={!groupSel.every((sel) => sel.length > 0)}
                className="btn btn-primary flex-initial w-50"
              >
                {t("estimator.form.nextButton", "Next")}
              </button>
            </div>
          </motion.div>
        )}

        {step === slides && !success && (
          <EstimatorContactForm
            company={company}
            setCompany={setCompany}
            email={email}
            setEmail={setEmail}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            phonePrefix={phonePrefix}
            setPhonePrefix={setPhonePrefix}
            countries={countries}
            consentChecked={consentChecked}
            setConsentChecked={setConsentChecked}
            loading={loading}
            error={error}
            onBack={goBack}
            onSubmit={handleSubmit}
          />
        )}

        {success && (
          <motion.div
            key="thanks"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
            transition={{ duration: 0.4 }}
            className=" rounded-2xl shadow-lg text-center"
          >
            <h2 className="text-2xl font-bold mb-4">
              {t("estimator.thanks.title", "Thank you!")}
            </h2>
            <p>
              {t(
                "estimator.thanks.message",
                "We’ve received your request and will get back to you soon."
              )}
            </p>
            <p className="mt-2">
              {t(
                "estimator.thanks.followup",
                "Inden for kort tid vil en af vores rådgivere tage kontakt til dig via den oplyste e-mail eller telefonnummer."
              )}
            </p>

            {/* 🎯 Tilføj denne knap */}
            <button onClick={resetEstimator} className="btn btn-primary mt-6">
              {t("estimator.thanks.closeButton", "Luk")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PriceEstimator;
