"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
          className="select select-ghost bg-base-200 w-full md:max-w-xs"
          value={selectedOption}
          onChange={handleChange}
          aria-label={t("TaskSelect.aria.selectTask")}
          required
        >
          <option value="" disabled>
            {t("TaskSelect.placeholder")}
          </option>
          <option value="website">{t("TaskSelect.options.website")}</option>
          <option value="webshop">{t("TaskSelect.options.webshop")}</option>
          <option value="booking">{t("TaskSelect.options.booking")}</option>
          <option value="dashboard">{t("TaskSelect.options.dashboard")}</option>
          <option value="events">{t("TaskSelect.options.events")}</option>
          <option value="integration">
            {t("TaskSelect.options.integration")}
          </option>
          <option value="visualization">
            {t("TaskSelect.options.visualization")}
          </option>
          <option value="other">{t("TaskSelect.options.other")}</option>
        </select>
      </label>
    </fieldset>
  );
};

export default TaskSelect;
