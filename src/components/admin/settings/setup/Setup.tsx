"use client";

import React, { useState } from "react";
import SetupPackages from "./packages/SetupPackages";
import SetupPackagesEdit from "./packages/SetupPackagesEdit";

const Setup = () => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  return isEditing ? (
    <SetupPackagesEdit onClose={handleEditToggle} />
  ) : (
    <div className="flex flex-col gap-5">
      <SetupPackages onEdit={handleEditToggle} />
      <hr className="border-1 border-gray-400 rounded-md" />
    </div>
  );
};

export default Setup;
