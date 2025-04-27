"use client";

import React, { useState, FormEvent } from "react";
import { createRequest } from "@/lib/client/actions";
import TaskSelect from "./TaskSelect";
import ConsentModal from "../modal/ConsentModal";

const OfferForm = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [mail, setMail] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [hasTyped, setHasTyped] = useState(false);
  const charLimit = 200;
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  const validatePhoneNumber = (phoneNumber: string) => {
    const danishPhoneRegex = /^(?:\+45\d{8}|\d{8})$/;
    return danishPhoneRegex.test(phoneNumber);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validatePhoneNumber(mobile)) {
      setErrorText("Invalid phone number.");
      return;
    }
    if (!isChecked) {
      setErrorText("You must accept storage of your information.");
      return;
    }

    setIsLoading(true);
    setErrorText("");
    setSuccessText("");

    try {
      // 1) persist the request
      await createRequest(name, "", mobile, mail, category, isChecked, message);

      // 2) ask the API to send the emails
      const emailBody = [
        `Phone: ${mobile}`,
        `Category: ${category}`,
        `Consent given: ${isChecked ? "Yes" : "No"}`,
        "",
        "Message:",
        message,
      ].join("\n");

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: mail, message: emailBody }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Email send failed");
      }

      setIsSuccess(true);
      setSuccessText("Your request has been sent.");
    } catch (err: unknown) {
      console.error("Submit error:", err);
      if (err instanceof Error) {
        setErrorText(
          err.message || "Something went wrong. Please try again later."
        );
      } else {
        setErrorText("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= charLimit) {
      setMessage(val);
      setCharCount(val.length);
      if (!hasTyped) setHasTyped(true);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setSuccessText("");
    setErrorText("");
    setName("");
    setMail("");
    setMobile("");
    setCategory("");
    setMessage("");
    setIsChecked(false);
  };

  return (
    <div className="lg:max-w-2xl max-w-md w-full">
      {isSuccess ? (
        <div className="flex flex-col gap-4 bg-base-100 p-10 h-[600px]">
          <h2 className="text-xl font-bold">Thank you for your request!</h2>
          <p>We will get back to you as soon as possible.</p>
          <button onClick={handleClose} className="btn btn-primary mt-5">
            Close
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 bg-base-100 rounded-lg shadow-md p-8 md:p-10"
        >
          <h2 className="text-xl font-bold">Request a Quote</h2>

          {/* Name / Email / Phone */}
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-10">
            <div className="flex-1 flex flex-col gap-3">
              {/* Name */}
              <label htmlFor="name" className="form-control w-full max-w-xs">
                <span className="label-text md:text-base">Name</span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your name"
                  className="input input-bordered w-full max-w-xs"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
              {/* Email */}
              <label htmlFor="mail" className="form-control w-full max-w-xs">
                <span className="label-text md:text-base">Email Address</span>
                <input
                  id="mail"
                  name="mail"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  className="input input-bordered w-full max-w-xs"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  required
                />
              </label>
              {/* Phone */}
              <label htmlFor="phone" className="form-control w-full max-w-xs">
                <span className="label-text md:text-base">Phone Number</span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Enter your phone number"
                  className="input input-bordered w-full max-w-xs"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </label>
            </div>

            {/* Category & Message */}
            <div className="flex-1 flex flex-col gap-3">
              <TaskSelect onChange={setCategory} />
              <label
                htmlFor="message"
                className="form-control w-full max-w-xs relative"
              >
                <span className="label-text md:text-base">Message</span>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Describe your needs, preferred time, address, etc."
                  className="textarea textarea-bordered textarea-md text-base w-full max-w-xs resize-none"
                  value={message}
                  onChange={handleMessageChange}
                  maxLength={charLimit}
                  required
                />
                {hasTyped && (
                  <div className="text-right text-xs text-gray-500 absolute -bottom-5 right-0">
                    {charCount}/{charLimit}
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Consent */}
          <div className="flex items-center gap-3">
            <input
              id="consent"
              type="checkbox"
              className="checkbox checkbox-md checkbox-primary"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              required
            />
            <label htmlFor="consent" className="label-text text-xs max-w-60">
              I accept the storage of my information for up to 30 days 
              <ConsentModal buttonText="Read more" variant="primary" />
            </label>
          </div>

          {errorText && <p className="text-error">{errorText}</p>}
          {successText && <p className="text-success">{successText}</p>}

          <button
            type="submit"
            className="btn btn-primary mt-5"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Request"}
          </button>
        </form>
      )}
    </div>
  );
};

export default OfferForm;
