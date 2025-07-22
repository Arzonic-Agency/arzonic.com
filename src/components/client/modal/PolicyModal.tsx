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

  return (
    <>
      {/* Link to open modal */}
      <span
        className={`font-medium link ${
          variant === "primary" ? "link-primary" : "link-hover"
        }`}
        onClick={() => setIsOpen(true)}
      >
        {buttonText}
      </span>

      {/* Modal */}
      {isOpen && (
        <div className="modal modal-open fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-box max-w-2xl p-6 bg-base-100 rounded-lg shadow-lg text-base-content">
            <Policy />
            <div
              className="modal-action justify-between items-center"
              onClick={() => setIsOpen(false)}
            >
              <Link href="/policy" className="btn btn-link">
                {t("privacy_policy")}
              </Link>
              <button
                className="btn btn-primary"
                onClick={() => setIsOpen(false)}
              >
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
