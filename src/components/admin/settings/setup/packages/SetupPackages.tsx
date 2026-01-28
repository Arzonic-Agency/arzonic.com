import React from "react";
import SetupPackagesList from "./SetupPackagesList";

interface Package {
  id: string;
  name: string;
  description: string;
}

interface SetupPackagesProps {
  onEdit: (pkg: Package) => void;
}

const SetupPackages = ({ onEdit }: SetupPackagesProps) => {
  return (
    <div className="flex flex-col gap-5">
      <SetupPackagesList onEdit={onEdit} />
    </div>
  );
};

export default SetupPackages;
