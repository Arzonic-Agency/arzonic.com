"use client";

import React, { useEffect, useState } from "react";
import i18n from "./config";
import { I18nextProvider } from "react-i18next";

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const lang = i18n.language || "da";

    const loadTranslations = async () => {
      if (!i18n.hasResourceBundle(lang, "translation")) {
        try {
          const res = await fetch(`/api/content/${lang}`);
          const data = await res.json();

          i18n.addResourceBundle(lang, "translation", data, true, true);
        } catch (err) {
          console.error("Kunne ikke hente oversættelser:", err);
        }
      }

      if (i18n.isInitialized) {
        setReady(true);
      } else {
        i18n.on("initialized", () => setReady(true));
      }
    };

    loadTranslations();
  }, []);

  if (!ready) {
    return <div className="p-4 text-center">Indlæser oversættelser...</div>;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
