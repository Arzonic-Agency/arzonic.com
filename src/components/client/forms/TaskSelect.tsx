"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // Import translation hook

interface ContactSelectProps {
  onChange: (value: string) => void;
}

const TaskSelect = ({ onChange }: ContactSelectProps) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedOption(value);
    onChange(value);
  };

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">{t("TaskSelect.legend")}</legend>
      <label className="form-control w-full">
        <select
          className="select select-ghost bg-base-200 select-md w-full md:max-w-xs"
          value={selectedOption}
          onChange={handleChange}
          aria-label={t("TaskSelect.aria.selectTask")}
          required
        >
          <option value="" disabled>
            {t("TaskSelect.placeholder")}
          </option>
          <option value="Website">{t("TaskSelect.options.website")}</option>
          <option value="Web App">{t("TaskSelect.options.webApp")}</option>
          <option value="3D Visualization">
            {t("TaskSelect.options.visualization")}
          </option>
          <option value="Branding">{t("TaskSelect.options.branding")}</option>
          <option value="Marketing">{t("TaskSelect.options.marketing")}</option>
          <option value="Other">{t("TaskSelect.options.other")}</option>
        </select>
      </label>
    </fieldset>
  );
};

export default TaskSelect;
