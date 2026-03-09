import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { FaGripVertical, FaPen } from "react-icons/fa6";
import DocsSectionCard from "./DocsSectionCard";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

interface DocsTopicCardProps {
  topic: Topic;
  sections: Section[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit?: (topic: Topic) => void;
  onAddSection?: (topicId: string) => void;
  onEditSection?: (section: Section) => void;
  onReorderSections?: (topicId: string, sectionIds: string[]) => Promise<void>;
  topicDragHandle?: React.ReactNode;
  t?: (key: string) => string;
}

interface SortableSectionItemProps {
  section: Section;
  onEdit?: (section: Section) => void;
  t: (key: string) => string;
}

const SortableSectionItem = ({
  section,
  onEdit,
  t,
}: SortableSectionItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <DocsSectionCard
        section={section}
        onEdit={onEdit}
        dragHandle={
          <button
            ref={setActivatorNodeRef}
            type="button"
            className="btn btn-ghost btn-xs btn-circle cursor-grab active:cursor-grabbing"
            aria-label={t("reorder") || "Reorder"}
            title={t("reorder") || "Reorder"}
            {...attributes}
            {...listeners}
          >
            <FaGripVertical size={12} />
          </button>
        }
      />
    </div>
  );
};

const DocsTopicCard = ({
  topic,
  sections,
  isExpanded,
  onToggleExpand,
  onEdit,
  onAddSection,
  onEditSection,
  onReorderSections,
  topicDragHandle,
  t: propsT,
}: DocsTopicCardProps) => {
  const { t: i18nT } = useTranslation();
  const t = propsT || i18nT;
  const [sectionItems, setSectionItems] = useState<Section[]>(sections);
  const sectionCount = sectionItems.length;
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  useEffect(() => {
    setSectionItems(sections);
  }, [sections]);

  const handleSectionDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sectionItems.findIndex(
      (section) => section.id === String(active.id),
    );
    const newIndex = sectionItems.findIndex(
      (section) => section.id === String(over.id),
    );

    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(sectionItems, oldIndex, newIndex);
    setSectionItems(reordered);

    if (!onReorderSections) return;

    try {
      await onReorderSections(
        topic.id,
        reordered.map((section) => section.id),
      );
    } catch (error) {
      console.error("Failed to reorder sections:", error);
      setSectionItems(sections);
    }
  };

  return (
    <div className="card bg-base-100 shadow-md border border-base-300">
      <div className="card-body flex flex-col">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              {topicDragHandle}
              <h2 className="card-title text-lg">{topic.title}</h2>
              {topic.is_hidden && (
                <span className="badge badge-error badge-sm">
                  {t("hidden")}
                </span>
              )}
            </div>
            {onEdit && (
              <button
                className="btn btn-ghost btn-xs btn-circle"
                onClick={() => onEdit(topic)}
                title={t?.("edit") || "Edit"}
                aria-label={t?.("edit") || "Edit"}
              >
                <FaPen size={16} />
              </button>
            )}
          </div>
          <div className="text-sm text-gray-500">/{topic.slug}</div>
          <div className="text-xs text-gray-500">
            {t("created")}: {new Date(topic.created_at).toLocaleDateString()}
          </div>

          <div className="divider my-2"></div>

          {sectionCount > 0 && (
            <button
              onClick={onToggleExpand}
              className="btn btn-sm btn-ghost justify-start"
            >
              {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
              <span className="badge badge-neutral">
                {sectionCount}{" "}
                {t(sectionCount === 1 ? "section_one" : "section_other")}
              </span>
            </button>
          )}

          {isExpanded && sectionCount > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleSectionDragEnd}
            >
              <SortableContext
                items={sectionItems.map((section) => section.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="mt-4 space-y-2">
                  {sectionItems.map((section) => (
                    <SortableSectionItem
                      key={section.id}
                      section={section}
                      onEdit={onEditSection}
                      t={t}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {sectionCount === 0 && (
            <div className="text-xs opacity-60 my-2">
              {t("no_sections_yet")}
            </div>
          )}
        </div>

        <div className="mt-auto pt-4">
          {onAddSection && sectionCount > 0 && isExpanded && (
            <button
              onClick={() => onAddSection(topic.id)}
              className="btn btn-xs btn-ghost w-full"
              title="Add section"
            >
              <FaPlus /> {t?.("add") || "Add"}
            </button>
          )}

          {onAddSection && sectionCount === 0 && (
            <button
              onClick={() => onAddSection(topic.id)}
              className="btn btn-xs btn-ghost w-full"
              title="Add section"
            >
              <FaPlus /> {t?.("add_first_section") || "Add first section"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocsTopicCard;
