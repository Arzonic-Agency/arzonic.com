// SetupPackagesEdit.tsx
import React, { useState } from "react";
import { updatePackage } from "@/lib/server/actions";

interface SetupPackagesEditProps {
  packageData: {
    id: string;
    label: string;
    price_eur: number;
    price_dkk: number;
  };
  onSave: () => void;
}

const SetupPackagesEdit: React.FC<SetupPackagesEditProps> = ({ packageData, onSave }) => {
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
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Label</legend>
        <input
          type="text"
          className="input w-full"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </fieldset>

      {/* Price in EUR */}
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Price (EUR)</legend>
        <input
          type="number"
          className="input w-full"
          value={priceEur}
          onChange={(e) => setPriceEur(Number(e.target.value))}
        />
      </fieldset>

      {/* Price in DKK */}
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Price (DKK)</legend>
        <input
          type="number"
          className="input w-full"
          value={priceDkk}
          onChange={(e) => setPriceDkk(Number(e.target.value))}
        />
      </fieldset>

      <button className="btn btn-primary" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default SetupPackagesEdit;
