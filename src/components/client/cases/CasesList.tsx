"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { FaLocationDot } from "react-icons/fa6";

interface CasesListProps {
  page: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
}

interface CaseItem {
  id: number;
  companyName: string;
  description: string;
  image?: string;
  city: string;
  created_at: string;
}

const FALLBACK_IMAGE = "/demo.jpg";

const CasesList: React.FC<CasesListProps> = ({ page, setTotal }) => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [caseItems, setCaseItems] = useState<CaseItem[]>([]);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cases?page=${page}&lang=${i18n.language}`);
      if (!res.ok) throw new Error("Failed to load cases");
      const { cases, total } = await res.json();
      setCaseItems(cases);
      setTotal(total);
    } catch (err) {
      console.error("Failed to fetch cases:", err);
      setCaseItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, setTotal, i18n.language]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("da-DK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center gap-3 items-center w-full">
        <span className="loading loading-spinner loading-md h-40" />
        {t("loading_cases")}
      </div>
    );
  }

  if (caseItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-lg text-gray-500">{t("no_cases")}</p>
      </div>
    );
  }

  return (
    <div className="md:max-w-lg lg:max-w-3xl xl:max-w-4xl flex flex-col gap-10 md:gap-16 p-1 md:p-0">
      {caseItems.map((item) => (
        <div
          key={item.id}
          className="card lg:card-side bg-base-100 shadow-md rounded-xl sm:rounded-lg lg:h-72 xl:h-[330px]"
        >
          <figure className="relative w-full lg:w-1/2 h-56 lg:h-full">
            <div className="relative w-full h-full">
              <Image
                src={item.image || FALLBACK_IMAGE}
                alt={item.companyName}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          </figure>
          <div className="card-body w-full lg:w-1/2 gap-5">
            <h2 className="card-title">{item.companyName}</h2>
            <p className="text-[15px] md:text-base">{item.description}</p>
            <div className="font-semibold flex items-center justify-between w-full">
              <span className="font-medium text-gray-500">
                {formatDate(item.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <FaLocationDot /> {item.city}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CasesList;
