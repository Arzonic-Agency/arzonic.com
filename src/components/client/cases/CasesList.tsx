"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

interface CasesListProps {
  cases: any[];
  page: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  onEditCase: (caseId: number) => void;
}

interface CaseItem {
  id: number;
  companyName: string;
  description: string;
  image: string | null;
}

const FALLBACK_IMAGE = "/demo.jpg";

const CasesList: React.FC<CasesListProps> = ({
  cases,
  page,
  setTotal,
  onEditCase,
}) => {
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

  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + "…" : text;

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
    <div className="w-full">
      <div className="flex flex-col gap-5 w-full">
        {caseItems.map((item) => (
          <div
            key={item.id}
            className="card card-compact shadow-xl bg-base-200 rounded-md"
          >
            <figure className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={item.image || FALLBACK_IMAGE}
                alt={item.companyName}
                fill
                className="object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-lg">{item.companyName}</h2>
              <p className="text-xs">{truncate(item.description, 100)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CasesList;
