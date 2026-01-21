"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaAngleRight, FaLocationDot } from "react-icons/fa6";
import { FiArrowRight } from "react-icons/fi";
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
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row gap-6 p-4 rounded-2xl bg-base-200/30 border border-base-200/50"
          >
            {/* Skeleton billede */}
            <div className="skeleton w-full md:w-80 aspect-video md:aspect-4/3 rounded-xl shrink-0" />

            {/* Skeleton indhold */}
            <div className="flex flex-col justify-between py-2 flex-1">
              <div>
                <div className="skeleton h-6 w-48 mb-3" />
                <div className="skeleton h-4 w-full mb-2" />
                <div className="skeleton h-4 w-3/4" />
              </div>

              {/* Skeleton footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-base-200/50">
                <div className="flex items-center gap-4">
                  <div className="skeleton h-3 w-20" />
                  <div className="skeleton h-3 w-24" />
                </div>
              </div>
            </div>
          </div>
        ))}
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
      <div className="flex flex-col gap-10 max-w-4xl mx-auto">
        {cases.map((item, index) => {
          const hasWebsite = !!item.website;
          
          const cardContent = (
            <>
              {/* Billede */}
              <div className="relative md:w-80 aspect-video md:aspect-4/3 rounded-xl overflow-hidden shrink-0">
                <Image
                  src={item.image || FALLBACK_IMAGE}
                  alt={item.company}
                  fill
                  className={`object-cover transition-transform duration-500 ${hasWebsite ? "group-hover:scale-105" : ""}`}
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              </div>

              {/* Indhold */}
              <div className="flex flex-col justify-between py-2 flex-1">
                <div>
                  <h2 className={`text-xl font-bold mb-3 ${hasWebsite ? "group-hover:text-primary transition-colors" : ""}`}>
                    {item.company}
                  </h2>
                  <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">
                    {item.desc}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-base-200/50">
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span>{formatDate(item.created_at)}</span>
                    <span className="flex items-center gap-1">
                      <FaLocationDot className="text-primary/70" />
                      {item.city}
                    </span>
                  </div>
                  {hasWebsite && (
                    <span className="flex items-center text-sm md:text-base font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      {t("case_view")}
                      <FaAngleRight className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </div>
              </div>
            </>
          );

          return (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="group"
            >
              {hasWebsite ? (
                <Link
                  href={item.website!}
                  className="flex flex-col md:flex-row gap-6 p-4 rounded-2xl bg-base-200/40 border-4 border-base-200/50 hover:border-accent transition-all duration-300"
                  aria-label={
                    t("aria.navigation.linkToCases") || "Go to customer's website"
                  }
                >
                  {cardContent}
                </Link>
              ) : (
                <div className="flex flex-col md:flex-row gap-6 p-4 rounded-2xl bg-base-200/40 border-4 border-base-200/50 hover:border-accent transition-all duration-300">
                  {cardContent}
                </div>
              )}
            </motion.article>
          );
        })}
      </div>
    </div>
  );
};

export default CasesList; 