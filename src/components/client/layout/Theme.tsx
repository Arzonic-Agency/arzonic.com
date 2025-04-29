"use client";

import React, { useEffect, useState } from "react";

import { FaMoon } from "react-icons/fa6";
import { MdSunny } from "react-icons/md";

const Theme = () => {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "Light") {
      document.documentElement.setAttribute("data-theme", "Light");
      setIsLight(true);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      setIsLight(false);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isLight ? "Dark" : "Light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setIsLight(!isLight);
  };

  return (
    <label className="swap swap-rotate justify-start">
      <input
        type="checkbox"
        checked={isLight}
        onChange={toggleTheme}
        className="hidden"
      />

      {/* sun icon (light mode) */}
      <div className=" swap-off flex items-center gap-2">
        <MdSunny className="text-3xl" />
      </div>

      {/* moon icon (dark mode) */}
      <div className=" swap-on flex items-center gap-2">
        <FaMoon className="text-3xl" />
      </div>
    </label>
  );
};

export default Theme;
