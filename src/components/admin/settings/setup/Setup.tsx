"use client";

import React, { useState } from "react";
import SetupPackages from "./packages/SetupPackages";
import SetupPackagesEdit from "./packages/SetupPackagesEdit";
import SetupJobs from "./Jobs/SetupJobs";
import SetupJobsCreate from "./Jobs/SetupJobsCreate";
import SetupJobsDetails from "./Jobs/SetupJobsDetails";
import { useTranslation } from "react-i18next";

const Setup = () => {
  const { t } = useTranslation();

  const [isEditingPackage, setIsEditingPackage] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isViewingJobDetails, setIsViewingJobDetails] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handlePackageEditToggle = (pkg = null) => {
    setSelectedPackage(pkg);
    setIsEditingPackage((prev) => !prev);
  };

  const handleJobCreateToggle = () => {
    setIsCreatingJob((prev) => !prev);
    setSelectedJob(null);
  };

  const handleJobEditToggle = (job) => {
    setSelectedJob(job);
    setIsViewingJobDetails(true);
    setIsCreatingJob(false);
  };

  const handleSave = () => {
    setIsEditingPackage(false);
    setSelectedPackage(null);
    setIsCreatingJob(false);
    setSelectedJob(null);
    setIsViewingJobDetails(false);
  };

  const handleBackToMain = () => {
    setIsCreatingJob(false);
    setIsViewingJobDetails(false);
  };

  const handleJobDelete = () => {
    setIsViewingJobDetails(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="">
      {isEditingPackage ? (
        <div className="bg-base-200 rounded-lg shadow-md p-5 md:p-7">
          <SetupPackagesEdit
            packageData={selectedPackage}
            onSave={handleSave}
            onBack={() => handlePackageEditToggle(null)}
          />
        </div>
      ) : isCreatingJob ? (
        <div className="bg-base-200 rounded-lg shadow-md p-5 md:p-7">
          <SetupJobsCreate onSave={handleSave} onBack={handleBackToMain} />
        </div>
      ) : isViewingJobDetails ? (
        <div className="bg-base-200 rounded-lg shadow-md p-5 md:p-7">
          <SetupJobsDetails
            jobId={selectedJob?.id}
            onBack={handleBackToMain}
            onDelete={handleJobDelete}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="bg-base-200 rounded-lg shadow-md p-5 md:p-7">
            <SetupPackages onEdit={handlePackageEditToggle} />
          </div>
          <div className="bg-base-200 rounded-lg shadow-md p-5 md:p-7">
            <SetupJobs
              onEdit={(job) => handleJobEditToggle(job)}
              onCreate={handleJobCreateToggle}
            />
          </div>
        </div>
      )}
      {showToast && (
        <div className="toast bottom-20 md:bottom-0 toast-end">
          <div className="alert alert-success text-neutral-content">
            <span className="text-base md:text-lg">
              {t("setup.deleted_job")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Setup;
