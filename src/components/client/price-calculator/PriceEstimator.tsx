// arzonic/src/components/client/price-calculator/PriceEstimator.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getEstimatorQuestions,
  EstimatorQuestion,
  createContactRequest,
} from "@/lib/server/actions";
import { FaAngleLeft } from "react-icons/fa6";


const QUESTIONS_PER_SLIDE = 2;
const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
};

export default function PriceEstimator() {
  const [questionsState, setQuestionsState] = useState<EstimatorQuestion[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const qs = await getEstimatorQuestions();
        setQuestionsState(qs);
      } catch (err) {
        console.error("Error loading questions:", err);
      }
    })();
  }, []);

  const slides = Math.ceil(questionsState.length / QUESTIONS_PER_SLIDE);
  const [step, setStep] = useState<number>(-1);
  const [direction, setDirection] = useState<number>(0);
  const [groupSel, setGroupSel] = useState<string[][]>([]);
  const [answers, setAnswers] = useState<string[][]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const startIdx = step * QUESTIONS_PER_SLIDE;
  const currentQs =
    step >= 0 && step < slides
      ? questionsState.slice(startIdx, startIdx + QUESTIONS_PER_SLIDE)
      : [];

  useEffect(() => {
    if (step >= 0 && step < slides) {
      setGroupSel(Array.from({ length: currentQs.length }, () => []));
    }
  }, [step, currentQs.length]);

  const toggleOption = (idx: number, opt: string) => {
    setGroupSel((prev) => {
      const next = prev.map((arr) => [...arr]);
      const t = currentQs[idx].type;
      if (t === "single") next[idx] = [opt];
      else {
        const sel = next[idx];
        next[idx] = sel.includes(opt) ? sel.filter((s) => s !== opt) : [...sel, opt];
      }
      return next;
    });
  };

  const goNext = () => {
    setAnswers((prev) => [...prev, ...groupSel]);
    setDirection(1);
    setStep((p) => p + 1);
  };
  const goBack = () => {
    if (step === 0) {
      setDirection(-1);
      setStep(-1);
      setAnswers([]);
    } else if (step > 0) {
      setDirection(-1);
      setAnswers((prev) => prev.slice(0, prev.length - groupSel.length));
      setStep((p) => p - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const msgArr = questionsState.map((q, i) => `${q.text}: ${answers[i].join(", ")}`);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message: msgArr.join("\n") }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error sending email");

      await createContactRequest(name, email, msgArr);
      setDirection(1);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
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
            className="card bg-base-200 p-7 rounded-2xl shadow-lg flex flex-col gap-6 text-center"
          >
            <h2 className="text-2xl font-bold">Welcome!</h2>
            <p>Answer a few quick questions to get your custom estimate.</p>
            <button onClick={goNext} className="btn btn-primary w-full">
              Begin
            </button>
          </motion.div>
        )}
        {/* Slides */}
        {step >= 0 && step < slides && (
          <motion.div
            key={`slide-${step}`}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
            transition={{ duration: 0.4 }}
            className="card bg-base-200 p-7 rounded-2xl shadow-lg flex flex-col gap-7"
          >
            {currentQs.map((q, idx) => (
              <div key={q.id} className="flex flex-col gap-5">
                <h2 className="text-lg md:text-xl font-bold">{q.text}</h2>
                <div className="flex flex-col gap-3 mb-5">
                  {q.options.map((opt) => (
                    <label key={opt} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type={q.type === "single" ? "radio" : "checkbox"}
                        checked={groupSel[idx]?.includes(opt) ?? false}
                        onChange={() => toggleOption(idx, opt)}
                        className={
                          q.type === "single" ? "radio radio-primary" : "checkbox checkbox-primary"
                        }
                      />
                      <span>{opt}</span>
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
                Next
              </button>
            </div>
          </motion.div>
        )}
        {/* Form */}
        {step === slides && !success && (
          <motion.form
            key="form"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit}
            className="card bg-base-200 p-7 rounded-2xl shadow-lg flex flex-col gap-3"
          >
            <h2 className="text-2xl font-bold text-center">Almost done!</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <input
              type="text"
              placeholder="Your name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full"
            />
            <input
              type="email"
              placeholder="Your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full"
            />
            <div className="flex gap-3">
              <button onClick={goBack} type="button" className="btn btn-outline">
                <FaAngleLeft />
              </button>
              <button
                type="submit"
                className={`btn btn-primary flex-1 ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                Submit
              </button>
            </div>
          </motion.form>
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
            className="card bg-base-200 p-6 rounded-2xl shadow-lg text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Thank you!</h2>
            <p>We’ve received your request and will get back to you soon.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}