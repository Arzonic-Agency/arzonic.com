"use client";

import React, { useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import NewsList from "./NewsList";
import NewsPagination from "./NewsPagination";
import NewsListChange from "./NewsListChange";
import CreateNews from "./createNews/CreateNews";
import { useTranslation } from "react-i18next";

// Define a type for news items
interface NewsItem {
  id: number;
  title: string;
  content: string;
  images: string[]; // Add the 'images' property
  // Add other fields as needed
}

const News = () => {
  const { t } = useTranslation();
  const [view, setView] = useState<"cards" | "list">("cards");
  const [showCreateNews, setShowCreateNews] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [news, setNews] = useState<NewsItem[]>([]); // Use the updated type

  const fetchNews = async () => {
    // This will be used by the NewsList component to refresh data
  };

  const handleViewChange = (view: "cards" | "list") => {
    setView(view);
  };

  const handleNewsCreated = () => {
    setShowCreateNews(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex flex-col md:items-start gap-7">
      {showCreateNews ? (
        <div className="flex flex-col items-start gap-5">
          <button onClick={() => setShowCreateNews(false)} className="btn">
            <FaAngleLeft />
            {t("back")}
          </button>
          <CreateNews
            onNewsCreated={handleNewsCreated}
            setShowCreateNews={setShowCreateNews}
            fetchNews={fetchNews}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center w-full">
            <button
              onClick={() => setShowCreateNews(true)}
              className="btn btn-primary btn-sm md:btn-md"
            >
              {t("create")} {t("news")}
            </button>
            <NewsListChange onViewChange={handleViewChange} />
          </div>
          <NewsList
            view={view}
            newsItems={news}
            page={page}
            setTotal={setTotal}
            setNews={setNews}
          />
          <div className="flex w-full justify-center">
            <NewsPagination page={page} setPage={setPage} total={total} />
          </div>
        </>
      )}
      {showToast && (
        <div className="toast bottom-20 md:bottom-0 toast-end">
          <div className="alert alert-success text-neutral-content">
            <span className="text-base md:text-lg">
              {t("news_created")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
