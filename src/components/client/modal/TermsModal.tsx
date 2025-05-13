"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface TermsModalProps {
  buttonText: string;
  variant?: "primary" | "hover";
}

const TermsModal = ({ buttonText, variant = "hover" }: TermsModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <span
        className={`link ${
          variant === "primary" ? "link-primary" : "link-hover"
        }`}
        onClick={() => setIsOpen(true)}
      >
        {buttonText}
      </span>

      {isOpen && (
        <div className="modal modal-open fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-box max-w-2xl p-6 bg-base-100 rounded-lg shadow-lg">
            <h3 className="font-bold text-xl md:text-2xl py-2">
              {t("TermsModal.title")}
            </h3>

            <div className="py-2 text-xs text-neutral-400">
              <p>{t("TermsModal.effectiveFrom")}</p>
              <p>{t("TermsModal.effectiveNote")}</p>
            </div>

            <div className="py-4 text-sm max-h-96 overflow-y-auto flex flex-col gap-5">
              {[...Array(9)].map((_, i) => (
                <div key={i}>
                  <h4 className="font-semibold md:text-base mb-2">
                    {t(`TermsModal.section${i + 1}.title`)}
                  </h4>
                  <p>{t(`TermsModal.section${i + 1}.description`)}</p>
                </div>
              ))}

              <p className="mt-2 text-xs text-neutral-400">
                {t("TermsModal.lastUpdated")}
              </p>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={() => setIsOpen(false)}
              >
                {t("TermsModal.closeButton")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TermsModal;
