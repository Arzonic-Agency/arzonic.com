"use client";

import React, { useState } from "react";
import { updatePackage } from "@/lib/server/actions";
import { FaAngleLeft } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface SetupPackagesEditProps {
  packageData: {
    id: string;
    label: string;
    price_eur: number;
    price_dkk: number;
  };
  onSave: () => void;
  onBack: () => void;
}

const SetupPackagesEdit: React.FC<SetupPackagesEditProps> = ({
  packageData,
  onSave,
  onBack,
}) => {
  const { t } = useTranslation();

  const [label, setLabel] = useState(packageData.label);
  const [priceEur, setPriceEur] = useState<number>(packageData.price_eur);
  const [priceDkk, setPriceDkk] = useState<number>(packageData.price_dkk);

  const handleSave = async () => {
    try {
      await updatePackage(packageData.id, {
        label,
        price_eur: priceEur,
        price_dkk: priceDkk,
      });
      onSave();
    } catch (error) {
      console.error("Failed to update package:", error);
    }
  };

  return (
    <div className="p-5 space-y-4">
      <button onClick={onBack} className="btn btn-ghost">
        <FaAngleLeft />
        {t("setup.back")}
      </button>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t("setup.label")}</legend>
        <input
          type="text"
          className="input w-full max-w-xs"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          aria-label={t("setup.editLabel")}
        />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t("setup.priceEur")}</legend>
        <input
          type="number"
          className="input w-full max-w-xs"
          value={priceEur}
          onChange={(e) => setPriceEur(Number(e.target.value))}
          aria-label={t("setup.editPriceEur")}
        />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{t("setup.priceDkk")}</legend>
        <input
          type="number"
          className="input w-full max-w-xs"
          value={priceDkk}
          onChange={(e) => setPriceDkk(Number(e.target.value))}
          aria-label={t("setup.editPriceDkk")}
        />
      </fieldset>

      <button
        className="btn btn-primary"
        onClick={handleSave}
        aria-label={t("setup.save")}
      >
        {t("setup.save")}
      </button>
    </div>
  );
};

export default SetupPackagesEdit;
