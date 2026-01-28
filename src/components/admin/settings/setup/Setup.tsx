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
        <div className="bg-base-100 rounded-lg shadow-md p-5 md:p-7">
          <SetupPackagesEdit
            packageData={selectedPackage}
            onSave={handleSave}
            onBack={() => handlePackageEditToggle(null)}
          />
        </div>
      ) : isCreatingJob ? (
        <div className="bg-base-100 rounded-lg shadow-md p-5 md:p-7">
          <SetupJobsCreate onSave={handleSave} onBack={handleBackToMain} />
        </div>
      ) : isViewingJobDetails ? (
        <div className="bg-base-100 rounded-lg shadow-md p-5 md:p-7">
          <SetupJobsDetails
            jobId={selectedJob?.id}
            onBack={handleBackToMain}
            onDelete={handleJobDelete}
          />
        </div>
      ) : (
        <div className="flex flex-col xl:flex-row gap-3">
          <div className="collapse collapse-arrow lg:collapse-open bg-base-200 border-base-300 border lg:border-0 lg:rounded-lg lg:shadow-md lg:p-5 lg:md:p-7">
            <input type="checkbox" className="lg:hidden" />
            <div className="collapse-title font-semibold text-lg lg:text-xl xl:text-2xl lg:p-0! lg:pb-4! lg:cursor-default!">
              {t("packages")}
            </div>
            <div className="collapse-content lg:block! lg:visible!">
              <SetupPackages onEdit={handlePackageEditToggle} />
            </div>
          </div>
          <div className="collapse collapse-arrow lg:collapse-open bg-base-200 border-base-300 border lg:border-0 lg:rounded-lg lg:shadow-md lg:p-5 lg:md:p-7">
            <input type="checkbox" className="lg:hidden" />
            <div className="collapse-title font-semibold text-lg lg:text-xl xl:text-2xl lg:p-0! lg:pb-4! lg:cursor-default!">
              {t("setup.jobs")}
            </div>
            <div className="collapse-content lg:block! lg:visible!">
              <SetupJobs
                onEdit={(job) => handleJobEditToggle(job)}
                onCreate={handleJobCreateToggle}
              />
            </div>
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
