"use client";

import React, { useState } from "react";
import Link from "next/link";
import Policy from "@/components/elements/Policy";

interface PolicyModalProps {
  buttonText: string;
  variant?: "primary" | "hover";
}

const PolicyModal = ({ buttonText, variant = "hover" }: PolicyModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={openModal}
        className={`font-medium ${
          variant === "primary"
            ? "btn btn-link btn-primary p-0"
            : "link link-hover"
        }`}
      >
        {buttonText}
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="modal modal-open fixed inset-0 z-50"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-box max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Policy />

            <div className="modal-action justify-between">
              <Link href="/policy" className="btn btn-link">
                Read full policy
              </Link>
              <button className="btn btn-primary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PolicyModal;
