"use client";

import React, { useState, useEffect } from "react";
import { FaEllipsis, FaPen, FaTrash } from "react-icons/fa6";
import { deleteJob, updateJob } from "@/lib/server/actions";
import { useTranslation } from "react-i18next";

interface SetupJobsDetailsActionsProps {
  onEdit: () => void;
  jobId: string;
  onDelete: () => void;
  active: boolean;
}

const SetupJobsDetailsActions = ({
  onEdit,
  jobId,
  onDelete,
  active,
}: SetupJobsDetailsActionsProps) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [isActive, setIsActive] = useState(active);

  useEffect(() => {
    setIsActive(active);
  }, [active]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleDelete = async () => {
    try {
      await deleteJob(jobId);
      closeModal();
      onDelete();
      window.dispatchEvent(new Event("jobDeleted"));
    } catch (error) {
      console.error("Failed to delete job:", error);
    }
  };

  const handleToggleActive = async () => {
    try {
      const newActiveState = !isActive;
      await updateJob(jobId, { active: newActiveState });
      setIsActive(newActiveState);
    } catch (error) {
      console.error("Failed to update job active state:", error);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        className="btn sm:btn-sm"
        onClick={handleToggleActive}
        aria-label={t("aria.setupJobsDetailsActions.toggleActiveButton")}
      >
        <div className="inline-grid *:[grid-area:1/1]">
          <div
            className={`status ${
              isActive ? "status-primary" : "status-error"
            } animate-ping`}
          ></div>
          <div
            className={`status ${isActive ? "status-primary" : "status-error"}`}
          ></div>
        </div>
        {isActive ? t("jobsDetails.active") : t("jobsDetails.inactive")}
      </button>

      {/* Dropdown menu on small screens */}
      <div className="sm:hidden">
        <div className="dropdown dropdown-bottom dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn"
            aria-label={t("aria.setupJobsDetailsActions.dropdownMenu")}
          >
            <FaEllipsis size={20} />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 gap-2 p-2 shadow"
          >
            <li>
              <button
                onClick={onEdit}
                aria-label={t("aria.setupJobsDetailsActions.editButton")}
              >
                <FaPen /> {t("jobsDetails.edit")}
              </button>
            </li>
            <li>
              <button
                onClick={openModal}
                aria-label={t("aria.setupJobsDetailsActions.deleteButton")}
              >
                <FaTrash /> {t("jobsDetails.delete")}
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Buttons on larger screens */}
      <div className="hidden sm:flex gap-2 items-center">
        <button
          className="btn btn-sm"
          onClick={onEdit}
          aria-label={t("aria.setupJobsDetailsActions.editButton")}
        >
          <FaPen /> {t("jobsDetails.edit")}
        </button>
        <button
          className="btn btn-sm"
          onClick={openModal}
          aria-label={t("aria.setupJobsDetailsActions.deleteButton")}
        >
          <FaTrash /> {t("jobsDetails.delete")}
        </button>
      </div>

      {/* Delete confirmation modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {t("jobsDetails.delete_job_confirmation")}
            </h3>
            <p className="py-4">{t("jobsDetails.delete_job_prompt")}</p>
            <p className="text-sm text-warning">
              {t("jobsDetails.delete_job_warning")}
            </p>
            <div className="modal-action">
              <button className="btn" onClick={closeModal}>
                {t("jobsDetails.cancel")}
              </button>
              <button className="btn btn-error" onClick={handleDelete}>
                {t("jobsDetails.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupJobsDetailsActions;
