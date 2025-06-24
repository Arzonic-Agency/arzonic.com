"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

declare global {
  interface Window {
    calendar?: {
      schedulingButton: {
        load: (options: {
          url: string;
          color?: string;
          label?: string;
          target: HTMLElement;
        }) => void;
      };
    };
  }
}

export default function BookingButton() {
  const { t, i18n } = useTranslation();
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const scriptAddedRef = useRef(false);

  useEffect(() => {
    if (scriptAddedRef.current) return;
    scriptAddedRef.current = true;

    const loadScript = () => {
      const labelText = t("bookingMeeting"); // <-- flyttet herind

      if (
        typeof window !== "undefined" &&
        window.calendar?.schedulingButton &&
        buttonRef.current
      ) {
        buttonRef.current.innerHTML = ""; // ryd før load

        window.calendar.schedulingButton.load({
          url: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1iR5SgcQUmS6xM0XNRn3NundOGWONweQcykxK1xRHPgmCc0_l4Fu0hhTlKlLTP3nfbmF91YEEe?gv=true",
          color: "#048179",
          label: labelText,
          target: buttonRef.current,
        });
      }
    };

    // load style
    const styleId = "google-calendar-style";
    if (!document.getElementById(styleId)) {
      const link = document.createElement("link");
      link.id = styleId;
      link.rel = "stylesheet";
      link.href =
        "https://calendar.google.com/calendar/scheduling-button-script.css";
      document.head.appendChild(link);
    }

    // load script
    const scriptId = "google-calendar-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "https://calendar.google.com/calendar/scheduling-button-script.js";
      script.async = true;
      script.onload = loadScript;
      document.body.appendChild(script);
    } else {
      loadScript();
    }
  }, [t, i18n.language]); // dependency på t og sprog

  return <div ref={buttonRef} />;
}
