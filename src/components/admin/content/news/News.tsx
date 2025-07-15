"use client";

import React, { useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import NewsList from "./NewsList";
import NewsPagination from "./NewsPagination";
import NewsListChange from "./NewsListChange";
import CreateNews from "./createNews/CreateNews";
import UpdateNews from "./updateNews/UpdateNews";

const News = () => {
  const [view, setView] = useState<"cards" | "list">("cards");
  const [showCreateNews, setShowCreateNews] = useState(false);
  const [showUpdateNews, setShowUpdateNews] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const handleViewChange = (view: "cards" | "list") => {
    setView(view);
  };

  const handleNewsCreated = () => {
    setShowCreateNews(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleNewsUpdated = () => {
    setShowUpdateNews(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex flex-col md:items-start gap-7">
      {showCreateNews ? (
        <div className="flex flex-col items-start gap-5">
          <button
            onClick={() => setShowCreateNews(false)}
            className="btn btn-ghost"
          >
            <FaAngleLeft />
            Tilbage
          </button>
          <CreateNews onNewsCreated={handleNewsCreated} />
        </div>
      ) : showUpdateNews && selectedNewsId !== null ? (
        <div className="flex flex-col items-start gap-5">
          <button
            onClick={() => setShowUpdateNews(false)}
            className="btn btn-ghost"
          >
            <FaAngleLeft />
            Tilbage
          </button>
          <UpdateNews
            newsId={selectedNewsId}
            onNewsUpdated={handleNewsUpdated}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center w-full">
            <button
              onClick={() => setShowCreateNews(true)}
              className="btn btn-primary"
            >
              Opret nyhed
            </button>
            <NewsListChange onViewChange={handleViewChange} />
          </div>
          <NewsList
            view={view}
            page={page}
            setTotal={setTotal}
            onEditNews={(newsId: number) => {
              setSelectedNewsId(newsId);
              setShowUpdateNews(true);
            }}
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
              {showCreateNews ? "Nyhed oprettet" : "Nyhed opdateret"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
