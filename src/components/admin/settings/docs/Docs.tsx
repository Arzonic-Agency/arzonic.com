import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaAngleLeft } from "react-icons/fa6";
import DocsTopicList from "./DocsTopicList";
import DocsTopicCreate from "./DocsTopicCreate";

const Docs = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [selectedDocsId, setSelectedDocsId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleDocsCreated = () => {
    setShowRegister(false);
    setToastMessage(t("docs_created"));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDocsDeleted = () => {
    setToastMessage(t("docs_deleted"));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleUpdateDocsClick = (docsId: string) => {
    setSelectedDocsId(docsId);
    setShowUpdate(true);
  };

  return (
    <div className="flex flex-col gap-8 bg-base-200 rounded-box shadow-md p-5 md:p-7">
      {showRegister ? (
        <div className="flex flex-col items-start gap-5">
          <button
            onClick={() => setShowRegister(false)}
            className="btn btn-ghost "
          >
            <FaAngleLeft />
            {t("back")}
          </button>
          <DocsTopicCreate onSave={handleDocsCreated} />
        </div>
      ) : showUpdate && selectedDocsId ? (
        <div className="flex flex-col items-start gap-5">
          <button
            onClick={() => setShowUpdate(false)}
            className="btn btn-ghost "
          >
            <FaAngleLeft />
            {t("back")}
          </button>
        </div>
      ) : (
        <>
          <div>
            <button
              onClick={() => setShowRegister(true)}
              className="btn btn-primary "
            >
              {t("create_docs")}
            </button>
          </div>

          <div>
            <DocsTopicList />
          </div>
        </>
      )}
      {showToast && (
        <div className="toast bottom-20 md:bottom-0 toast-end">
          <div className="alert alert-success text-neutral-content">
            <span className="text-base md:text-lg">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Docs;
