import React from "react";
import { FaPen } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

const SetupPackagesList = ({ onEdit }) => {
  const { t } = useTranslation();
  return (
    <ul className="list bg-base-200 rounded-box shadow-md">
      <li className="list-row">
        <div>
          <img
            className="size-10 rounded-box"
            src="https://img.daisyui.com/images/profile/demo/1@94.webp"
          />
        </div>
        <div>
          <div>Dio Lupa</div>
          <div className="text-xs uppercase font-semibold opacity-60">
            Remaining Reason
          </div>
        </div>
        <button className="btn btn-sm" onClick={onEdit}>
          <FaPen /> <span className="md:flex hidden">{t("edit")}</span>
        </button>
      </li>

      <li className="list-row">
        <div>
          <img
            className="size-10 rounded-box"
            src="https://img.daisyui.com/images/profile/demo/4@94.webp"
          />
        </div>
        <div>
          <div>Ellie Beilish</div>
          <div className="text-xs uppercase font-semibold opacity-60">
            Bears of a fever
          </div>
        </div>
        <button className="btn btn-sm" onClick={onEdit}>
          <FaPen /> <span className="md:flex hidden">{t("edit")}</span>
        </button>
      </li>

      <li className="list-row">
        <div>
          <img
            className="size-10 rounded-box"
            src="https://img.daisyui.com/images/profile/demo/3@94.webp"
          />
        </div>
        <div>
          <div>Sabrino Gardener</div>
          <div className="text-xs uppercase font-semibold opacity-60">
            Cappuccino
          </div>
        </div>
        <button className="btn btn-sm" onClick={onEdit}>
          <FaPen /> <span className="md:flex hidden">{t("edit")}</span>
        </button>
      </li>
    </ul>
  );
};

export default SetupPackagesList;
