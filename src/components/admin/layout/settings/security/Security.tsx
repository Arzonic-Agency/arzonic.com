"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaDesktop,
  FaMobileAlt,
  FaTabletAlt,
  FaTrash,
  FaCheck,
  FaSync,
} from "react-icons/fa";
import { FaSpinner } from "react-icons/fa6";
import {
  getActiveSessions,
  revokeSession,
} from "@/lib/server/actions";

type Session = {
  id: string;
  endpoint: string;
  user_agent: string | null;
  created_at: string;
  updated_at: string | null;
  is_current: boolean;
};

const parseUserAgent = (userAgent: string | null) => {
  if (!userAgent) return { device: "Ukendt enhed", browser: "Ukendt browser", os: "Ukendt OS" };

  let device = "Desktop";
  let browser = "Ukendt browser";
  let os = "Ukendt OS";

  // Detect device type
  if (/mobile/i.test(userAgent)) {
    device = "Mobil";
  } else if (/tablet|ipad/i.test(userAgent)) {
    device = "Tablet";
  }

  // Detect browser
  if (/firefox/i.test(userAgent)) {
    browser = "Firefox";
  } else if (/edg/i.test(userAgent)) {
    browser = "Edge";
  } else if (/chrome/i.test(userAgent)) {
    browser = "Chrome";
  } else if (/safari/i.test(userAgent)) {
    browser = "Safari";
  } else if (/opera|opr/i.test(userAgent)) {
    browser = "Opera";
  }

  // Detect OS
  if (/windows/i.test(userAgent)) {
    os = "Windows";
  } else if (/macintosh|mac os/i.test(userAgent)) {
    os = "macOS";
  } else if (/linux/i.test(userAgent)) {
    os = "Linux";
  } else if (/android/i.test(userAgent)) {
    os = "Android";
  } else if (/iphone|ipad|ipod/i.test(userAgent)) {
    os = "iOS";
  }

  return { device, browser, os };
};

const getDeviceIcon = (device: string) => {
  switch (device) {
    case "Mobil":
      return <FaMobileAlt className="text-lg" />;
    case "Tablet":
      return <FaTabletAlt className="text-lg" />;
    default:
      return <FaDesktop className="text-lg" />;
  }
};

const Security = () => {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentEndpoint, setCurrentEndpoint] = useState<string | null>(null);

  // Hent den aktuelle browsers push subscription endpoint
  useEffect(() => {
    const getCurrentEndpoint = async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        return;
      }

      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          setCurrentEndpoint(subscription.endpoint);
        }
      } catch (err) {
        console.error("Kunne ikke hente push subscription:", err);
      }
    };

    getCurrentEndpoint();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getActiveSessions();
      if (result.success && result.sessions) {
        setSessions(result.sessions);
      } else {
        setError(result.error || "Kunne ikke hente sessioner");
      }
    } catch {
      setError("Der opstod en fejl ved hentning af sessioner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevoke = async (sessionId: string) => {
    setRevoking(sessionId);
    try {
      const result = await revokeSession(sessionId);
      if (result.success) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      } else {
        setError(result.error || "Kunne ikke fjerne session");
      }
    } catch {
      setError("Der opstod en fejl ved fjernelse af session");
    } finally {
      setRevoking(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("da-DK", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {t("settings.active_sessions", { defaultValue: "Aktive sessioner" })}
          </h3>
          <p className="text-sm text-zinc-500">
            {t("settings.active_sessions_desc", {
              defaultValue:
                "Enheder hvor du er logget ind og modtager notifikationer. Fjern adgang for enheder du ikke genkender.",
            })}
          </p>
        </div>
        <button
          onClick={fetchSessions}
          disabled={loading}
          className="btn btn-ghost btn-sm"
          title={t("settings.refresh_sessions", { defaultValue: "Opdater" })}
        >
          <FaSync className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="skeleton h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-8 text-zinc-500">
          <p>
            {t("settings.no_sessions", {
              defaultValue: "Ingen aktive sessioner fundet",
            })}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {[...sessions]
            .sort((a, b) => {
              // Sortér så current device er øverst
              const aIsCurrent = currentEndpoint ? a.endpoint === currentEndpoint : a.is_current;
              const bIsCurrent = currentEndpoint ? b.endpoint === currentEndpoint : b.is_current;
              if (aIsCurrent && !bIsCurrent) return -1;
              if (!aIsCurrent && bIsCurrent) return 1;
              return 0;
            })
            .map((session) => {
            const { device, browser, os } = parseUserAgent(session.user_agent);
            const isRevoking = revoking === session.id;
            // Match endpoint for at finde den aktuelle enhed
            const isCurrent = currentEndpoint
              ? session.endpoint === currentEndpoint
              : session.is_current;

            return (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-base-200 rounded-lg"
                  
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-base-300 rounded-lg">
                    {getDeviceIcon(device)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {browser} - {os}
                      </span>
                      {isCurrent && (
                        <span className="badge badge-primary badge-sm flex items-center gap-1">
                          <FaCheck className="text-xs" />
                          {t("security_settings.current")}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-500">{device}</p>
                    <p className="text-xs text-zinc-500">
                      {t("security_settings.last_active")}:{" "}
                      {formatDate(session.updated_at || session.created_at)}
                    </p>
                  </div>
                </div>
                {!isCurrent && (
                  <button
                    onClick={() => handleRevoke(session.id)}
                    disabled={isRevoking}
                    className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                    title={t("security_settings.revoke")}
                  >
                    {isRevoking ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaTrash />
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Security;
