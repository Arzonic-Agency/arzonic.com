"use client";

import React, { useEffect, useState } from "react";

const Overview = () => {
  const [data, setData] = useState({
    pageviews: 0,
    visitors: 0,
    visits: 0,
    pages: [],
    devices: [],
  });
  const [period, setPeriod] = useState("7d");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/umami?period=${period}`);
        const result = await response.json();
        setData({
          pageviews: result.pageviews || 0,
          visitors: result.visitors || 0,
          visits: result.visits || 0,
          pages: result.pages || [],
          devices: result.devices || [],
        });
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      }
    };

    fetchAnalytics();
  }, [period]);

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-base-100 rounded-lg shadow-md p-3 md:p-7">
        <div className="flex justify-end items-center">
          <div role="tablist" className="tabs  tabs-bordered">
            <button
              role="tab"
              className={`tab ${period === "7d" ? "tab-active" : ""}`}
              onClick={() => setPeriod("7d")}
            >
              7 dage
            </button>
            <button
              role="tab"
              className={`tab ${period === "30d" ? "tab-active" : ""}`}
              onClick={() => setPeriod("30d")}
            >
              30 dage
            </button>
          </div>
        </div>
        <h3 className="text-lg font-semibold">
          Statistikker ({period === "7d" ? "Seneste 7 dage" : "Seneste 30 dage"}
          )
        </h3>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <h4 className="text-sm">Besøgende</h4>
            <p className="text-3xl font-bold">{data.visitors}</p>
          </div>
          <div>
            <h4 className="text-sm">Sidevisninger</h4>
            <p className="text-3xl font-bold">{data.pageviews}</p>
          </div>
          <div>
            <h4 className="text-sm">Besøg</h4>
            <p className="text-3xl font-bold">{data.visits}</p>
          </div>
        </div>
      </div>

      <div className="bg-base-100 rounded-lg shadow-md p-3 md:p-7">
        <h3 className="text-lg font-semibold">Mest besøgte</h3>
        <ul className="mt-3">
          {Array.isArray(data.pages) && data.pages.length > 0 ? (
            data.pages.map((page, index) => (
              <li key={index} className="flex justify-between border-b py-2">
                <span>{page.x}</span>
                <span className="font-bold">{page.y}</span>
              </li>
            ))
          ) : (
            <p>Ingen data</p>
          )}
        </ul>
      </div>

      <div className="bg-base-100 rounded-lg shadow-md p-3 md:p-7">
        <h3 className="text-lg font-semibold">Enheder</h3>
        <ul className="mt-3">
          {data.devices.length > 0 ? (
            data.devices.map((device, index) => {
              const deviceMapping = {
                mobile: "Mobil",
                desktop: "Stationær",
                laptop: "Bærbar",
                tablet: "Tablet",
                unknown: "Ukendt",
              };

              const deviceName =
                deviceMapping[device.x.toLowerCase()] || device.x;

              return (
                <li key={index} className="flex justify-between border-b py-2">
                  <span>{deviceName}</span>
                  <span className="font-bold">{device.y}</span>
                </li>
              );
            })
          ) : (
            <p>Ingen data</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Overview;
