import React, { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { getPackages } from "@/lib/server/actions";

const SetupPackagesList = ({ onEdit }) => {
  const { t } = useTranslation();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const { packs } = await getPackages();
        setPackages(packs.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center gap-3 items-center">
        <span className="loading loading-spinner loading-md h-52"></span>
        {t("loading_packages")}
      </div>
    );
  }

  return (
    <ul className="list bg-base-200 rounded-box shadow-md">
      {packages.map((pkg) => (
        <li key={pkg.id} className="list-row">
          <div>
            <div className="font-bold">{pkg.label}</div>
            <div className="text-sm text-gray-500">
              {pkg.price_eur} EUR&nbsp;/&nbsp;{pkg.price_dkk} DKK
            </div>
          </div>
          <div>
            <div className="text-xs uppercase font-semibold opacity-60">
              {pkg.description}
            </div>
          </div>
          <button className="btn btn-sm" onClick={() => onEdit(pkg)}>
            <FaPen /> <span className="md:flex hidden">{t("edit")}</span>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default SetupPackagesList;
