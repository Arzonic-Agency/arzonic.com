// arzonic/src/components/client/price-calculator/PriceEstimator.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createContactRequest } from "@/lib/server/actions";
import { FaAngleLeft } from "react-icons/fa6";

type Question = {
  id: number;
  text: string;
  options: string[];
  type: "single" | "multiple";
};

const QUESTIONS_PER_SLIDE = 2;

const questions: Question[] = [
  {
    id: 1,
    text: "How many people are in your company?",
    options: ["Solo / Freelance", "2-5 People", "6-15 People", "15+ People"],
    type: "single",
  },
  {
    id: 2,
    text: "What should we help with?",
    options: [
      "Development of a webapp",
      "An advanced Dashboard for customers or a team",
      "An interactive 3D presentation",
      "A solution that can be modified by you or your team",
    ],
    type: "single",
  },
  {
    id: 3,
    text: "What should it be able to do?",
    options: [
      "Users with login feature",
      "Data presentation in a dashboard",
      "Option for 3D visualization",
      "Editable content via CMS",
      "Integration to own systems / API",
    ],
    type: "multiple",
  },
  {
    id: 4,
    text: "How far are you in the process?",
    options: [
      "Starting from scratch",
      "We have a solution that needs improvement",
      "We have an idea and need to start",
      "We have everything ready and need counseling",
    ],
    type: "single",
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export default function PriceEstimator() {
  const slides = Math.ceil(questions.length / QUESTIONS_PER_SLIDE);
  const [step, setStep] = useState<number>(-1);
  const [direction, setDirection] = useState<number>(0);
  const [answers, setAnswers] = useState<string[][]>([]);
  const [groupSel, setGroupSel] = useState<string[][]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const startIdx = step * QUESTIONS_PER_SLIDE;
  const currentQs =
    step >= 0 && step < slides
      ? questions.slice(startIdx, startIdx + QUESTIONS_PER_SLIDE)
      : [];

  useEffect(() => {
    if (step >= 0 && step < slides) {
      setGroupSel(Array.from({ length: currentQs.length }, () => []));
    }
  }, [step, currentQs.length]);

  const toggleOption = (idx: number, option: string) => {
    setGroupSel((prev) => {
      const next = prev.map((arr) => [...arr]);
      const qType = currentQs[idx].type;

      if (qType === "single") {
        next[idx] = [option];
      } else {
        const selections = next[idx];
        next[idx] = selections.includes(option)
          ? selections.filter((s) => s !== option)
          : [...selections, option];
      }

      return next;
    });
  };

  const goNext = () => {
    setAnswers((prev) => [...prev, ...groupSel]);
    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const goBack = () => {
    if (step === 0) {
      setDirection(-1);
      setStep(-1);
      setAnswers([]);
    } else if (step > 0) {
      setDirection(-1);
      setAnswers((prev) => prev.slice(0, prev.length - groupSel.length));
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const messageArray = questions.map(
      (q, i) => `${q.text}: ${answers[i].join(", ")}`
    );
    const messageText = messageArray.join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message: messageText }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error sending email");

      await createContactRequest(name, email, messageArray);

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
        {/* Intro Screen */}
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
            <h2 className="text-2xl font-bold">Welcome to Our Estimator</h2>
            <p>
              Answer a few questions to get a custom estimate. It only takes a
              minute!
            </p>
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
                  {q.options.map((option) => (
                    <label
                      key={option}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type={q.type === "single" ? "radio" : "checkbox"}
                        checked={groupSel[idx]?.includes(option) ?? false}
                        onChange={() => toggleOption(idx, option)}
                        className={`${
                          q.type === "single"
                            ? "radio radio-primary"
                            : "checkbox checkbox-primary"
                        }`}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex gap-3">
              <button onClick={goBack} className="btn">
                <FaAngleLeft size={20} />
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

        {/* Final Contact Form */}
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
