"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Overview = () => {
  const { t } = useTranslation();
  const [data, setData] = useState({
    pageviews: 0,
    visitors: 0,
    visits: 0,
    pages: [],
    devices: [],
  });
  const [period, setPeriod] = useState("7d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/umami?period=${period}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-base-200 rounded-lg shadow-md p-3 md:p-7">
        <div className="flex justify-end items-center mb-5">
          <div role="tablist" className="tabs tabs-border">
            <button
              role="tab"
              className={`tab ${period === "7d" ? "tab-active" : ""}`}
              onClick={() => setPeriod("7d")}
              aria-label={t("aria.overview.last7DaysTab")}
            >
              {t("analytics.last_7_days")}
            </button>
            <button
              role="tab"
              className={`tab ${period === "30d" ? "tab-active" : ""}`}
              onClick={() => setPeriod("30d")}
              aria-label={t("aria.overview.last30DaysTab")}
            >
              {t("analytics.last_30_days")}
            </button>
          </div>
        </div>
        <h3 className="text-lg font-semibold">
          {t("analytics.title")} (
          {period === "7d"
            ? t("analytics.last_7_days")
            : t("analytics.last_30_days")}
          )
        </h3>

        {loading ? (
          <div className="flex justify-start items-center h-32 gap-3">
            <span
              className="loading loading-spinner loading-md"
              aria-label={t("aria.overview.loadingSpinner")}
            />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <h4 className="text-sm">{t("analytics.visitors")}</h4>
              <p className="text-3xl font-bold">{data.visitors}</p>
            </div>
            <div>
              <h4 className="text-sm">{t("analytics.pageviews")}</h4>
              <p className="text-3xl font-bold">{data.pageviews}</p>
            </div>
            <div>
              <h4 className="text-sm">{t("analytics.visits")}</h4>
              <p className="text-3xl font-bold">{data.visits}</p>
            </div>
          </div>
        )}
      </div>
      <div className="bg-base-200 rounded-lg shadow-md p-3 md:p-7">
        <h3 className="text-lg font-semibold">{t("analytics.most_visited")}</h3>
        {loading ? (
          <div className="flex justify-start items-center h-32 gap-3">
            <span className="loading loading-spinner loading-md" />
          </div>
        ) : data.pages.length > 0 ? (
          <ul className="flex flex-col gap-3 mt-3">
            {data.pages.map((page, index) => (
              <li
                key={index}
                className="flex justify-between border-b border-zinc-600 py-2"
              >
                <span>{page.x}</span>
                <span className="font-bold">{page.y}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-neutral-400 mt-3">{t("analytics.no_data")}</p>
        )}
      </div>
      <div className="bg-base-200 rounded-lg shadow-md p-3 md:p-7">
        <h3 className="text-lg font-semibold">{t("analytics.devices")}</h3>
        {loading ? (
          <div className="flex justify-start items-center h-32 gap-3">
            <span className="loading loading-spinner loading-md" />
          </div>
        ) : data.devices.length > 0 ? (
          <ul className="flex flex-col gap-3 mt-3">
            {data.devices.map((device, index) => {
              const deviceMapping = {
                mobile: t("analytics.mobile"),
                desktop: t("analytics.desktop"),
                laptop: t("analytics.laptop"),
                tablet: t("analytics.tablet"),
                unknown: t("analytics.unknown"),
              };
              const deviceName =
                deviceMapping[device.x?.toLowerCase()] || device.x;

              return (
                <li
                  key={index}
                  className="flex justify-between border-b border-zinc-600 py-2"
                >
                  <span>{deviceName}</span>
                  <span className="font-bold">{device.y}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-neutral-400 mt-3">{t("analytics.no_data")}</p>
        )}
      </div>
    </div>
  );
};

export default Overview;
