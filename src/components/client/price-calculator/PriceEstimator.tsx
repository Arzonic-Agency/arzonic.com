"use client";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRive } from "@rive-app/react-canvas";

const VAT_RATES: Record<string, { name: string; rate: number }> = {
  NONE: { name: "No VAT", rate: 0 },
  DK: { name: "Denmark", rate: 0.25 },
  DE: { name: "Germany", rate: 0.19 },
  FR: { name: "France", rate: 0.2 },
  ES: { name: "Spain", rate: 0.21 },
  IT: { name: "Italy", rate: 0.22 },
  NL: { name: "Netherlands", rate: 0.21 },
  BE: { name: "Belgium", rate: 0.21 },
  SE: { name: "Sweden", rate: 0.25 },
  GB: { name: "United Kingdom", rate: 0.2 },
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const PriceEstimator = () => {
  const { t } = useTranslation();
  const { RiveComponent } = useRive({
    src: "/rive/design.riv",
    autoplay: true,
  });

  const {
    data: packsData,
    error: packsError,
    isLoading: loadingPacks,
  } = useSWR("/api/packages", fetcher);
  const {
    data: servicesData,
    error: servicesError,
    isLoading: loadingServices,
  } = useSWR("/api/services", fetcher);

  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("DK");

  useEffect(() => {
    const locale = navigator.language;
    const country = locale.split("-")[1]?.toUpperCase() ?? "DK";
    if (VAT_RATES[country]) setSelectedCountry(country);
  }, []);

  const toggleService = (id: string) =>
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  if (loadingPacks || loadingServices) return <p>{t("loading")}</p>;
  if (packsError || servicesError) return <p>{t("error_loading_data")}</p>;

  const packs = packsData?.packs || [];
  const services = servicesData?.services || [];

  const chosenPack = packs.find((p) => p.id === selectedPackId);
  const packPrice = chosenPack?.price ?? 0;

  const extrasTotal = selectedServiceIds
    .map((id) => services.find((s) => s.id === id)?.price ?? 0)
    .reduce((a, b) => a + b, 0);

  const subtotal = packPrice + extrasTotal;
  const vatInfo = VAT_RATES[selectedCountry] || { name: "No VAT", rate: 0 };
  const vatAmount = Math.round(subtotal * vatInfo.rate * 100) / 100;
  const total = Math.round((subtotal + vatAmount) * 100) / 100;

  return (
    <div className="flex items-center justify-evenly">
      <div className="w-[50%]">
        <div className="p-6 max-w-md mx-auto bg-base-200 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">
            {t("PriceEstimator.title")}
          </h2>

          <div className="form-control mb-6">
            <span className="label-text font-medium block mb-2">
              {t("PriceEstimator.choosePack")}
            </span>
            <div className="flex flex-col space-y-2">
              {packs.map((p: any) => (
                <label key={p.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="pack"
                    className="radio radio-primary"
                    value={p.id}
                    checked={selectedPackId === p.id}
                    onChange={() => setSelectedPackId(p.id)}
                  />
                  <span className="label-text">
                    {t("PriceEstimator.packLabel", {
                      price: p.price,
                      label: p.label,
                    })}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {selectedPackId && (
            <>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-medium">
                    {t("PriceEstimator.countryForVAT")}
                  </span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  {Object.entries(VAT_RATES).map(([code, info]) => (
                    <option key={code} value={code}>
                      {info.name} ({info.rate * 100}%)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control mb-6">
                <span className="label-text font-medium block mb-2">
                  {t("PriceEstimator.addServices")}
                </span>
                <div className="flex flex-wrap gap-4">
                  {services.map((s: any) => (
                    <label
                      key={s.id}
                      className="tooltip tooltip-primary flex items-center space-x-2"
                      data-tip={s.description}
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={selectedServiceIds.includes(s.id)}
                        onChange={() => toggleService(s.id)}
                      />
                      <span className="label-text">
                        {t("PriceEstimator.serviceLabel", {
                          price: s.price,
                          label: s.label,
                        })}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="divider" />
          <div className="text-lg mb-1">
            {t("PriceEstimator.subtotal")}:{" "}
            <span className="font-semibold">€{subtotal}</span>
          </div>
          <div className="text-lg mb-1">
            {t("PriceEstimator.vat", {
              name: vatInfo.name,
              rate: vatInfo.rate * 100,
            })}
            : <span className="font-semibold">€{vatAmount}</span>
          </div>
          <div className="text-2xl font-bold mb-4">
            {t("PriceEstimator.totalInclVAT")}: <span>€{total}</span>
          </div>

          <Link href="/contact" className="btn btn-primary w-full">
            {t("PriceEstimator.getInTouch")}
          </Link>

          <p className="text-sm italic text-gray-500 mt-4">
            {t("PriceEstimator.disclaimer")}
          </p>
        </div>
      </div>
      <div className=" flex items-center justify-center w-[50%]  lg:block">
        <div className="h-[500px] w-full">
          <RiveComponent />
        </div>
      </div>
    </div>
  );
};

export default PriceEstimator;
