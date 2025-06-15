import React from "react";
import SetupPackagesList from "./SetupPackagesList";
import { useTranslation } from "react-i18next";

interface Package {
  id: string;
  name: string;
  description: string;
}

interface SetupPackagesProps {
  onEdit: (pkg: Package) => void;
}

const SetupPackages = ({ onEdit }: SetupPackagesProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-xl">{t("packages")}</h3>
      <SetupPackagesList onEdit={onEdit} />
    </div>
  );
};

export default SetupPackages;
