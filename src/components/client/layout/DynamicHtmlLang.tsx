"use client";

import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function DynamicHtmlLang() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Update HTML lang attribute when language changes
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return null;
}
