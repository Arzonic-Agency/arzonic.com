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
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

export default function PriceEstimator() {
  // 1) Fetch questions (with option IDs)
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

  // 2) Pagination state
  const slides = Math.ceil(questionsState.length / QUESTIONS_PER_SLIDE);
  const [step, setStep] = useState(-1); // -1 == intro screen
  const [direction, setDirection] = useState(0);

  // 3) Track selected option IDs
  const [groupSel, setGroupSel] = useState<number[][]>([]);
  const [answers, setAnswers] = useState<number[][]>([]);

  // 4) Contact form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // derive current questions slice
  const startIdx = step * QUESTIONS_PER_SLIDE;
  const currentQs =
    step >= 0 && step < slides
      ? questionsState.slice(startIdx, startIdx + QUESTIONS_PER_SLIDE)
      : [];

  // reset per‐slide selections on slide change
  useEffect(() => {
    if (step >= 0 && step < slides) {
      setGroupSel(Array.from({ length: currentQs.length }, () => []));
    }
  }, [step, currentQs.length, slides]);

  // toggle option by its numeric ID
  const toggleOption = (qIdx: number, optId: number) => {
    setGroupSel((prev) => {
      const next = prev.map((arr) => [...arr]);
      const isSingle = currentQs[qIdx].type === "single";
      if (isSingle) {
        next[qIdx] = [optId];
      } else {
        const sel = next[qIdx];
        next[qIdx] = sel.includes(optId)
          ? sel.filter((i) => i !== optId)
          : [...sel, optId];
      }
      return next;
    });
  };

  // navigation handlers
  const goNext = () => {
    setAnswers((prev) => [...prev, ...groupSel]);
    setDirection(1);
    setStep((s) => s + 1);
  };
  const goBack = () => {
    if (step === 0) {
      setDirection(-1);
      setStep(-1);
      setAnswers([]);
    } else if (step > 0) {
      setDirection(-1);
      setAnswers((prev) => prev.slice(0, prev.length - groupSel.length));
      setStep((s) => s - 1);
    }
  };

  // submit everything
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // build payload: [{ questionId, optionIds[] }, ...]
    const structured = questionsState.map((q, i) => ({
      questionId: q.id,
      optionIds: answers[i] || [],
    }));

    try {
      // (optional) send user a summary email
      const msg = questionsState
        .map((q, i) => `${q.text}: ${answers[i]?.join(", ")}`)
        .join("\n");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message: msg }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error sending email");

      // persist to `requests` + `responses`
      await createContactRequest(name, email, structured);
      setDirection(1);
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
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
            className="card bg-base-200 p-7 rounded-2xl shadow-lg flex flex-col gap-6 text-center"
          >
            <h2 className="text-2xl font-bold">Welcome!</h2>
            <p>Answer a few quick questions to get your custom estimate.</p>
            <button onClick={goNext} className="btn btn-primary w-full">
              Begin
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
            className="card bg-base-200 p-7 rounded-2xl shadow-lg flex flex-col gap-7"
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
                Next
              </button>
            </div>
          </motion.div>
        )}

        {/* Final Form */}
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
              <button
                onClick={goBack}
                type="button"
                className="btn btn-outline"
              >
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
