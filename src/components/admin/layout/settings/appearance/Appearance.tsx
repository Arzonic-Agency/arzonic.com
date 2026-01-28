"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaMoon } from "react-icons/fa6";
import { MdSunny } from "react-icons/md";
import { FaDesktop } from "react-icons/fa6";

const Appearance = () => {
  const LIGHT_THEME = "arzoniclight";
  const DARK_THEME = "arzonicdark";
  const AUTO_THEME = "auto";
  const THEME_KEY = "dashboard-theme";

  const [themeMode, setThemeMode] = useState<"light" | "dark" | "auto">("dark");
  const { t } = useTranslation();

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY);

    if (storedTheme === AUTO_THEME) {
      setThemeMode("auto");
      applyAutoTheme();

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyAutoTheme();
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else if (storedTheme === LIGHT_THEME) {
      setThemeMode("light");
      document.documentElement.setAttribute("data-theme", LIGHT_THEME);
    } else if (storedTheme === DARK_THEME) {
      setThemeMode("dark");
      document.documentElement.setAttribute("data-theme", DARK_THEME);
    } else {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      if (currentTheme === LIGHT_THEME) {
        setThemeMode("light");
      } else {
        setThemeMode("dark");
        document.documentElement.setAttribute("data-theme", DARK_THEME);
      }
    }
  }, []);

  const applyAutoTheme = () => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const themeToApply = prefersDark ? DARK_THEME : LIGHT_THEME;
    document.documentElement.setAttribute("data-theme", themeToApply);
  };

  const handleThemeChange = (mode: "light" | "dark" | "auto") => {
    setThemeMode(mode);

    if (mode === "auto") {
      localStorage.setItem(THEME_KEY, AUTO_THEME);
      applyAutoTheme();

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyAutoTheme();
      mediaQuery.addEventListener("change", handleChange);
    } else {
      const themeToApply = mode === "light" ? LIGHT_THEME : DARK_THEME;
      document.documentElement.setAttribute("data-theme", themeToApply);
      localStorage.setItem(THEME_KEY, themeToApply);
    }
  };

  const themeOptions = [
    {
      value: "light" as const,
      label: t("light"),
      icon: MdSunny,
      description: t("appearance.light_mode_description", {
        defaultValue: "Brug lyst tema",
      }),
    },
    {
      value: "dark" as const,
      label: t("dark"),
      icon: FaMoon,
      description: t("appearance.dark_mode_description", {
        defaultValue: "Brug mørkt tema",
      }),
    },
    {
      value: "auto" as const,
      label: t("appearance.auto", { defaultValue: "Auto" }),
      icon: FaDesktop,
      description: t("appearance.auto_description", {
        defaultValue: "Følg system indstilling",
      }),
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-base-content/70 mb-6">
        {t("appearance.description", {
          defaultValue: "Vælg dit foretrukne tema",
        })}
      </p>

      <div className="flex flex-col gap-3">
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = themeMode === option.value;

          return (
            <button
              key={option.value}
              onClick={() => handleThemeChange(option.value)}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-base-300 bg-base-200 hover:border-base-content/20"
              }`}
              aria-label={`${t("appearance.select")} ${option.label}`}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                  isSelected ? "bg-primary text-primary-content" : "bg-base-300"
                }`}
              >
                <Icon className="text-lg" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-base">{option.label}</div>
                <div className="text-sm text-base-content/70">
                  {option.description}
                </div>
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary-content"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Appearance;
