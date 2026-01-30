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
      <ul className="list">
        {[...Array(3)].map((_, index) => (
          <li key={index} className="list-row">
            <div>
              <div className="skeleton h-5 w-32 mb-2"></div>
              <div className="skeleton h-4 w-40"></div>
            </div>
            <div>
              <div className="skeleton h-4 w-48"></div>
            </div>
            <div className="skeleton h-8 w-20"></div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="list">
      {packages.map((pkg) => (
        <li key={pkg.id} className="list-row px-0 py-4">
          <div>
            <div className="font-bold">{pkg.label}</div>
            <div className="text-sm text-gray-500">
              {pkg.yearly_eur} EUR&nbsp;/&nbsp;{pkg.yearly_dkk} DKK
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
