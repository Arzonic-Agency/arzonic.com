import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Language = () => {
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
      <div
        className="swap-on flex items-center gap-2 text-3xl"
        aria-label={t(
          "aria.language.changeToDanish",
          "Change language to Danish"
        )}
      >
        <span>🇩🇰</span>
      </div>
      <div
        className="swap-off flex items-center gap-2 text-3xl"
        aria-label={t(
          "aria.language.changeToEnglish",
          "Change language to English"
        )}
      >
        <span>🇬🇧</span>
      </div>
    </label>
  );
};

export default Language;
