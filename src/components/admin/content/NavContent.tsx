"use client";

import React, { useEffect, useState } from "react";
import { FaRegNewspaper, FaStar, FaSuitcase } from "react-icons/fa6";
import Cases from "./cases/Cases";
import Reviews from "./reviews/Reviews";
import { useTranslation } from "react-i18next";
import News from "./news/News";
import {
  getCasesCount,
  getNewsCount,
  getReviewsCount,
} from "@/lib/server/actions";

const NavContent = () => {
  const [activeTab, setActiveTab] = useState("news");
  const { t } = useTranslation();
  const [newsCount, setNewsCount] = useState<number | null>(null);
  const [casesCount, setCasesCount] = useState<number | null>(null);
  const [reviewsCount, setReviewsCount] = useState<number | null>(null);

  useEffect(() => {
    let isActive = true;

    const fetchCounts = async () => {
      try {
        const [newsTotal, casesTotal, reviewsTotal] = await Promise.all([
          getNewsCount(),
          getCasesCount(),
          getReviewsCount(),
        ]);

        if (isActive) {
          setNewsCount(newsTotal);
          setCasesCount(casesTotal);
          setReviewsCount(reviewsTotal);
        }
      } catch (error) {
        console.error("Failed to fetch content counts:", error);
        if (isActive) {
          setNewsCount(0);
          setCasesCount(0);
          setReviewsCount(0);
        }
      }
    };

    fetchCounts();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="w-full">
      <div role="tablist" className="tabs sm:tabs-lg w-full  text-[15px]">
        <button
          role="tab"
          className={`tab gap-2  ${
            activeTab === "news"
              ? "tab-active bg-base-200 rounded-lg shadow-md"
              : ""
          }`}
          onClick={() => setActiveTab("news")}
          aria-label={t("aria.navContent.reviewsTab")}
        >
          <FaRegNewspaper />
          {t("news_more")}
        </button>
        <button
          role="tab"
          className={`tab gap-2  ${
            activeTab === "cases"
              ? "tab-active bg-base-200 rounded-lg shadow-md"
              : ""
          }`}
          onClick={() => setActiveTab("cases")}
          aria-label={t("aria.navContent.casesTab")}
        >
          <FaSuitcase />
          Cases
        </button>
        <button
          role="tab"
          className={`tab gap-2  ${
            activeTab === "reviews"
              ? "tab-active bg-base-200 rounded-lg shadow-md"
              : ""
          }`}
          onClick={() => setActiveTab("reviews")}
          aria-label={t("aria.navContent.reviewsTab")}
        >
          <FaStar />
          {t("reviews")}
        </button>
      </div>
      <div className="mt-3 2xl:flex gap-3">
        <div className="flex-3/4 4xl:flex-5/6">
          {activeTab === "news" && (
            <div className="bg-base-200 rounded-lg shadow-md p-5 md:p-7">
              <News />
            </div>
          )}
          {activeTab === "cases" && (
            <div className="bg-base-200 rounded-lg shadow-md p-5 md:p-7">
              <Cases />
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="bg-base-200  rounded-lg shadow-md p-5 md:p-7">
              <Reviews />
            </div>
          )}
        </div>
        <div className="hidden 3xl:flex flex-col gap-3 gao flex-1/4 4xl:flex-1/6">
          <div className="bg-base-200 rounded-box shadow-md p-5 md:p-7 flex flex-col gap-5 h-fit">
            <h4>Oversigt over indhold</h4>
            <div className="text-sm text-gray-400 font-medium">
              {newsCount === null
                ? t("loading_news")
                : t("sidebar_content_amount_news", { count: newsCount })}
            </div>
            <div className="text-sm text-gray-400 font-medium">
              {casesCount === null
                ? t("loading_cases")
                : t("sidebar_content_amount_cases", { count: casesCount })}
            </div>
            <div className="text-sm text-gray-400 font-medium">
              {reviewsCount === null
                ? t("loading_reviews")
                : t("sidebar_content_amount_reviews", { count: reviewsCount })}
            </div>
          </div>
          <div className="bg-base-200 rounded-box shadow-md p-5 md:p-7 flex flex-col gap-5 h-fit">
            <h4>Opdateringer</h4>
            <div className="text-sm text-gray-400 font-medium">
              Ingen nye opdateringer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavContent;
