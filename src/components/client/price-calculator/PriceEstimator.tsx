'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createContactRequest } from '@/lib/server/actions';

type Question = {
  id: number;
  text: string;
  options: string[];
  type: 'single' | 'multiple';
};

const questions: Question[] = [
  {
    id: 1,
    text: 'How many people are in your company?',
    options: ['Solo / Freelance', '2-5 People', '6-15 People', '15+ People'],
    type: 'single',
  },
  {
    id: 2,
    text: 'What should we help with?',
    options: [
      'Development of a webapp',
      'An advanced Dashboard for customers or a team',
      'An interactive 3D presentation',
      'A solution that can be modified by you or your team',
    ],
    type: 'single',
  },
  {
    id: 3,
    text: 'What should it be able to do?',
    options: [
      'Users with login feature',
      'Data presentation in a dashboard',
      'Option for 3D visualization',
      'Editable content via CMS',
      'Integration to own systems / API',
    ],
    type: 'multiple',
  },
  {
    id: 4,
    text: 'How far are you in the process?',
    options: [
      'Starting from scratch',
      'We have a solution that needs improvement',
      'We have an idea and needs to start',
      'We have everything ready and needs counseling',
    ],
    type: 'single',
  },
];

const slideVariants = {
  enter:  { x: 300, opacity: 0 },
  center: { x:   0, opacity: 1 },
  exit:   { x:-300, opacity: 0 },
};

export default function PriceEstimator() {
  const [step, setStep]                   = useState(0);
  const [answers, setAnswers]             = useState<string[][]>([]);
  const [currentSelections, setCurrentSelections] = useState<string[]>([]);
  const [name, setName]                   = useState('');
  const [email, setEmail]                 = useState('');
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [success, setSuccess]             = useState(false);

  // Reset selections when question changes
  useEffect(() => {
    setCurrentSelections([]);
  }, [step]);

  const toggleOption = (opt: string) => {
    if (questions[step].type === 'single') {
      setCurrentSelections([opt]);
    } else {
      setCurrentSelections(sel =>
        sel.includes(opt)
          ? sel.filter(s => s !== opt)
          : [...sel, opt]
      );
    }
  };

  const handleNext = () => {
    setAnswers(prev => [...prev, currentSelections]);
    setStep(prev => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const messageArray = questions.map(
      (q, i) => `${q.text}: ${answers[i].join(', ')}`
    );
    const messageString = messageArray.join('\n');

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, message: messageString }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error sending contact email.');
      }

      const { requestId } = await createContactRequest(
        name,
        email,
        messageArray
      );
      console.log('Created request:', requestId);

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full card bg-base-200 p-6 rounded-2xl shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Thank you!</h2>
        <p>We’ve received your request and will get back to you soon.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <AnimatePresence initial={false} mode="wait">
        {step < questions.length ? (
          <motion.div
            key={questions[step].id}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="card bg-base-200 p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">
              {questions[step].text}
            </h2>
            <div className="flex flex-col space-y-3 mb-6">
              {questions[step].options.map(opt => (
                <label
                  key={opt}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type={
                      questions[step].type === 'single'
                        ? 'radio'
                        : 'checkbox'
                    }
                    name={`q${questions[step].id}`}
                    checked={currentSelections.includes(opt)}
                    onChange={() => toggleOption(opt)}
                    className={
                      questions[step].type === 'single'
                        ? 'radio radio-primary'
                        : 'checkbox checkbox-primary'
                    }
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={currentSelections.length === 0}
              className="btn btn-primary w-full"
            >
              Next
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="contact"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit}
            className="card bg-base-200 p-6 rounded-2xl shadow-lg space-y-4"
          >
            <h2 className="text-2xl font-bold text-center">Almost done!</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <input
              type="text"
              placeholder="Your name"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="input input-bordered w-full"
            />
            <input
              type="email"
              placeholder="Your email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input input-bordered w-full"
            />
            <button
              type="submit"
              className={`btn btn-primary w-full ${
                loading ? 'loading' : ''
              }`}
              disabled={loading}
            >
              Submit
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
