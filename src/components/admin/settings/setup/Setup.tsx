"use client";

import React, { useState } from "react";
import SetupPackages from "./packages/SetupPackages";
import SetupPackagesEdit from "./packages/SetupPackagesEdit";
import { FaAngleLeft } from "react-icons/fa";

const Setup = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handleEditToggle = (pkg = null) => {
    setSelectedPackage(pkg);
    setIsEditing((prev) => !prev);
  };

  const handleSave = () => {
    setIsEditing(false);
    setSelectedPackage(null);
    // Optionally refresh the package list or perform other actions
  };

  return (
    <div className="p-5">
      {isEditing ? (
        <div>
          <button
            onClick={() => handleEditToggle(null)}
            className="btn btn-ghost"
          >
            <FaAngleLeft />
            Back
          </button>
          <SetupPackagesEdit
            packageData={selectedPackage}
            onClose={() => handleEditToggle(null)}
            onSave={handleSave}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <SetupPackages onEdit={handleEditToggle} />
          <hr className="border-1 border-gray-400 rounded-md" />
        </div>
      )}
    </div>
  );
};

export default Setup;
