import React from "react";
import SetupPackagesList from "./SetupPackagesList";

const SetupPackages = ({ onEdit }) => {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-xl">Packages</h3>
      <SetupPackagesList onEdit={onEdit} />
    </div>
  );
};

export default SetupPackages;
