"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
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
        <span className="loading loading-dots loading-xl text-secondary h-96" />
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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 p-1 md:p-4">
      {caseItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          className="rounded-lg overflow-hidden bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          <div className="relative h-60">
            <Image
              src={item.image || FALLBACK_IMAGE}
              alt={item.companyName}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-5 flex flex-col justify-evenly h-52">
            <h3 className="text-lg font-bold">{item.companyName}</h3>
            <p className="text-sm text-zinc-400 line-clamp-3">
              {item.description}
            </p>
            <div className="text-xs text-zinc-500 flex justify-between pt-4">
              <span>{formatDate(item.created_at)}</span>
              <span className="flex items-center gap-1">
                <FaLocationDot className="text-zinc-400" />
                {item.city}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CasesList;
