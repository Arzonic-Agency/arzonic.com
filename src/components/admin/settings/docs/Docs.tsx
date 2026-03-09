import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaAngleLeft } from "react-icons/fa6";
import DocsTopicList from "./DocsTopicList";
import DocsTopicCreate from "./DocsTopicCreate";
import DocsSectionCreate from "@/components/admin/settings/docs/DocsSectionCreate";
import DocsTopicEdit from "@/components/admin/settings/docs/DocsTopicEdit";
import DocsSectionEdit from "@/components/admin/settings/docs/DocsSectionEdit";

type DocsViewMode =
  | "list"
  | "topic-create"
  | "section-create"
  | "topic-edit"
  | "section-edit";

interface Topic {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  order_index: number;
  is_hidden: boolean;
}

interface Section {
  id: string;
  topic_id: string;
  title: string;
  slug: string;
  description: string;
  order_index: number;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
}

const Docs = () => {
  const [viewMode, setViewMode] = useState<DocsViewMode>("list");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [refreshKey, setRefreshKey] = useState(0);
  const { t } = useTranslation();

  const showToastMessage = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleOperationError = (message: string) => {
    showToastMessage(message || t("docs_operation_failed"), "error");
  };

  const handleTopicCreated = () => {
    setViewMode("list");
    setRefreshKey((prev) => prev + 1);
    showToastMessage(t("docs_created"));
  };

  const handleSectionCreated = () => {
    setViewMode("list");
    setSelectedTopicId(null);
    setRefreshKey((prev) => prev + 1);
    showToastMessage(t("docs_section_created"));
  };

  const handleAddSection = (topicId: string) => {
    setSelectedTopicId(topicId);
    setViewMode("section-create");
  };

  const handleEditTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setViewMode("topic-edit");
  };

  const handleEditSection = (section: Section) => {
    setSelectedSection(section);
    setViewMode("section-edit");
  };

  const handleTopicUpdated = () => {
    setViewMode("list");
    setSelectedTopic(null);
    setRefreshKey((prev) => prev + 1);
    showToastMessage(t("topic_updated"));
  };

  const handleTopicDeleted = () => {
    setViewMode("list");
    setSelectedTopic(null);
    setRefreshKey((prev) => prev + 1);
    showToastMessage(t("topic_deleted"));
  };

  const handleSectionUpdated = () => {
    setViewMode("list");
    setSelectedSection(null);
    setRefreshKey((prev) => prev + 1);
    showToastMessage(t("section_updated"));
  };

  const handleSectionDeleted = () => {
    setViewMode("list");
    setSelectedSection(null);
    setRefreshKey((prev) => prev + 1);
    showToastMessage(t("section_deleted"));
  };

  const handleBack = () => {
    setViewMode("list");
    setSelectedTopicId(null);
    setSelectedTopic(null);
    setSelectedSection(null);
  };

  return (
    <div className="flex flex-col gap-8 bg-base-200 rounded-box shadow-md p-5 md:p-7">
      {viewMode !== "list" ? (
        <div className="flex flex-col items-start gap-5">
          <button onClick={handleBack} className="btn btn-ghost ">
            <FaAngleLeft />
            {t("back")}
          </button>

          {viewMode === "topic-create" && (
            <DocsTopicCreate
              onSave={handleTopicCreated}
              onError={handleOperationError}
            />
          )}
          {viewMode === "topic-edit" && selectedTopic && (
            <DocsTopicEdit
              topicData={selectedTopic}
              onSave={handleTopicUpdated}
              onDelete={handleTopicDeleted}
              onError={handleOperationError}
            />
          )}
          {viewMode === "section-create" && selectedTopicId && (
            <DocsSectionCreate
              topicId={selectedTopicId}
              onSave={handleSectionCreated}
              onError={handleOperationError}
            />
          )}
          {viewMode === "section-edit" && selectedSection && (
            <DocsSectionEdit
              sectionData={selectedSection}
              onSave={handleSectionUpdated}
              onDelete={handleSectionDeleted}
              onError={handleOperationError}
            />
          )}
        </div>
      ) : (
        <>
          <div>
            <button
              onClick={() => setViewMode("topic-create")}
              className="btn btn-primary w-36"
            >
              {t("create_topic")}
            </button>
          </div>

          <div>
            <DocsTopicList
              key={refreshKey}
              onEdit={handleEditTopic}
              onAddSection={handleAddSection}
              onEditSection={handleEditSection}
              onError={handleOperationError}
            />
          </div>
        </>
      )}
      {showToast && (
        <div className="toast bottom-20 md:bottom-0 toast-end">
          <div
            className={`alert ${
              toastType === "success"
                ? "alert-success text-neutral-content"
                : "alert-error"
            }`}
          >
            <span className="text-base md:text-lg">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Docs;
