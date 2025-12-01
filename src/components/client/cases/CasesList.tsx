
"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaLocationDot } from "react-icons/fa6";
import Link from "next/link";

export interface CaseItem {
  id: number;
  company: string;
  desc: string;
  image?: string | null;
  city: string;
  created_at: string;
  website: string | null;
}

interface CasesListProps {
  cases: CaseItem[];
  loading: boolean;
}

const FALLBACK_IMAGE = "/demo.jpg";

const CasesList: React.FC<CasesListProps> = ({ cases, loading }) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("da-DK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  if (loading && cases.length === 0) {
    return (
      <div className="flex justify-center gap-3 items-center w-full">
        <span className="loading loading-dots loading-xl text-secondary h-96" />
      </div>
    );
  }

  if (!loading && cases.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-lg text-gray-500">{t("no_cases")}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && cases.length > 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-base-100/80">
          <span className="loading loading-dots loading-lg text-secondary" />
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 ">
        {cases.map((item, index) => (
        <motion.article
          key={item.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          className="rounded-xl overflow-hidden p-2 bg-accent  md:hover:bg-base-200 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-primary transition-shadow duration-300 ease-in-out shadow-md hover:shadow-xl "
        >
          <Link
            href={item.website || "/cases"}
            className="w-full block"
            aria-label={
              t("aria.navigation.linkToCases") || "Go to customer's website"
            }
          >
            {/* Billedet */}
            <div className="relative w-[full] aspect-[16/13] mx-4">
              <Image
                src={item.image || FALLBACK_IMAGE}
                alt={item.company}
                fill
                className="object-cover opacity-80 hover:opacity-100 hover:scale-102 transition-all duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Tekst */}
            <div className="p-5 flex flex-col justify-evenly min-h-[200px]">
              <h2 className="text-lg font-bold">{item.company}</h2>
              <p className="text-sm text-zinc-400 line-clamp-4">{item.desc}</p>
              <div className="text-xs text-zinc-500 flex justify-between pt-4">
                <span>{formatDate(item.created_at)}</span>
                <span className="flex items-center gap-1">
                  <FaLocationDot className="text-zinc-400" />
                  {item.city}
                </span>
              </div>
            </div>
          </Link>
        </motion.article>
        ))}
      </div>
    </div>
  );
};

export default CasesList;
