import Image from "next/image";
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
        <Image
          src="/DK.png"
          alt="Skift til dansk"
          width={20}
          height={20}
          quality={100}
          unoptimized
        />
        <span>Dansk</span>
      </div>
      <div
        className="swap-off flex items-center gap-2"
        aria-label={t("aria.language.changeToEnglish")}
      >
        <Image
          src="/UK.png"
          alt="Change to English"
          width={20}
          height={20}
          quality={100}
          unoptimized
        />

        <span>English</span>
      </div>
    </label>
  );
};

export default LanguageAdmin;
