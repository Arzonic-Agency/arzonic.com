import React, { useState } from "react";
import { updatePackage } from "@/lib/server/actions";

const SetupPackagesEdit = ({ packageData, onClose, onSave }) => {
  const [label, setLabel] = useState(packageData.label);
  const [price, setPrice] = useState(packageData.price);

  const handleSave = async () => {
    try {
      await updatePackage(packageData.id, { label, price });
      onSave(); // Callback to refresh the list or handle success
    } catch (error) {
      console.error("Failed to update package:", error);
    }
  };

  return (
    <div className="p-5">
      <fieldset className="fieldset mb-3">
        <legend className="fieldset-legend">Label</legend>
        <input
          type="text"
          className="input"
          placeholder="Type here"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </fieldset>
      <fieldset className="fieldset mb-3">
        <legend className="fieldset-legend">Price</legend>
        <input
          type="text"
          className="input"
          placeholder="Type here"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </fieldset>
      <button className="btn btn-primary" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default SetupPackagesEdit;
