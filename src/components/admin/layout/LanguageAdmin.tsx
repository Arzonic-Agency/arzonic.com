import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageAdmin = () => {
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
        aria-label={
          isEnglish
            ? t("aria.language.changeToDanish")
            : t("aria.language.changeToEnglish")
        }
      />
      <div
        className="swap-on flex items-center gap-2"
        aria-label={t("aria.language.changeToDanish")}
      >
        <span>🇩🇰</span>
        <span>Dansk</span>
      </div>
      <div
        className="swap-off flex items-center gap-2"
        aria-label={t("aria.language.changeToEnglish")}
      >
        <span>🇬🇧</span>
        <span>English</span>
      </div>
    </label>
  );
};

export default LanguageAdmin;
