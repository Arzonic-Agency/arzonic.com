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

const SetupPackages: React.FC<SetupPackagesProps> = ({ onEdit }) => {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-xl">Packages</h3>
      <SetupPackagesList onEdit={onEdit} />
    </div>
  );
};

export default SetupPackages;
