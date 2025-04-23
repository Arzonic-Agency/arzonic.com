import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageToggle = () => {
  const { i18n, t } = useTranslation();
  const [isEnglish, setIsEnglish] = useState(i18n.language === "en");

  useEffect(() => {
    i18n.changeLanguage(isEnglish ? "en" : "da");
  }, [isEnglish, i18n]);

  return (
    <label className="swap swap-rotate cursor-pointer justify-start">
      <input
        type="checkbox"
        checked={isEnglish}
        onChange={() => setIsEnglish(!isEnglish)}
      />
      <div className="swap-on flex items-center gap-2">
        <span>🇩🇰</span>
        <span>Dansk</span>
      </div>
      <div className="swap-off flex items-center gap-2">
        <span>🇬🇧</span>
        <span>English</span>
      </div>
    </label>
  );
};

export default LanguageToggle;
