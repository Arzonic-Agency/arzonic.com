"use client";

import Policy from "@/components/elements/Policy";
import Link from "next/link";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface PolicyModalProps {
  buttonText: string;
  variant?: "primary" | "hover";
}

const PolicyModal = ({ buttonText, variant = "hover" }: PolicyModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Link to open modal */}
      <span
        className={`font-medium link cursor-pointer ${
          variant === "primary" ? "link-primary" : "link-hover"
        }`}
        onClick={() => setIsOpen(true)}
      >
        {buttonText}
      </span>

      {/* Modal */}
      {isOpen && (
        <div
          className="modal modal-open fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label={t("Policy.title")}
        >
          <div
            className="modal-box max-w-2xl p-6 bg-base-100 rounded-lg shadow-lg text-base-content overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // stop click from bubbling to overlay
          >
            <Policy />

            <div className="modal-action justify-between items-center mt-6">
              <Link href="/policy" className="btn btn-link">
                {t("privacy_policy")}
              </Link>
              <button className="btn btn-primary" onClick={handleClose}>
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PolicyModal;
