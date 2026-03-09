import React from "react";
import { useTranslation } from "react-i18next";
import { FaPen } from "react-icons/fa6";

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

interface DocsSectionCardProps {
  section: Section;
  onEdit?: (section: Section) => void;
  dragHandle?: React.ReactNode;
}

const DocsSectionCard = ({
  section,
  onEdit,
  dragHandle,
}: DocsSectionCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="p-3 bg-base-200 rounded-lg border border-base-300">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {dragHandle}
          <div className="font-medium text-sm">{section.title}</div>
          {section.is_hidden && (
            <span className="badge badge-error badge-sm">{t("hidden")}</span>
          )}
        </div>
        {onEdit && (
          <button
            className="btn btn-ghost btn-xs btn-circle"
            onClick={() => onEdit(section)}
            title={t("edit")}
            aria-label={t("edit")}
          >
            <FaPen size={12} />
          </button>
        )}
      </div>
      <div className="text-xs opacity-70 mt-1">/{section.slug}</div>
      <div className="text-xs opacity-60 mt-1">
        {t("created")}: {new Date(section.created_at).toLocaleDateString()}
      </div>
    </div>
  );
};

export default DocsSectionCard;
