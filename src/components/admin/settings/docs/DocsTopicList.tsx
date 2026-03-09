"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getAllSectionsByTopicId,
  getAllTopics,
  updateDocsSectionsOrder,
  updateDocsTopicsOrder,
} from "@/lib/server/actions";
import DocsTopicCard from "./DocsTopicCard";
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
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaGripVertical } from "react-icons/fa6";

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

interface DocsTopicListProps {
  onEdit?: (topic: Topic) => void;
  onAddSection?: (topicId: string) => void;
  onEditSection?: (section: Section) => void;
  onError?: (message: string) => void;
}

interface SortableTopicItemProps {
  topic: Topic;
  sections: Section[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit?: (topic: Topic) => void;
  onAddSection?: (topicId: string) => void;
  onEditSection?: (section: Section) => void;
  onReorderSections: (topicId: string, sectionIds: string[]) => Promise<void>;
  t: (key: string) => string;
}

const SortableTopicItem = ({
  topic,
  sections,
  isExpanded,
  onToggleExpand,
  onEdit,
  onAddSection,
  onEditSection,
  onReorderSections,
  t,
}: SortableTopicItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: topic.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <DocsTopicCard
        topic={topic}
        sections={sections}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
        onEdit={onEdit}
        onAddSection={onAddSection}
        onEditSection={onEditSection}
        onReorderSections={onReorderSections}
        topicDragHandle={
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
        t={t}
      />
    </div>
  );
};

const DocsTopicList = ({
  onEdit,
  onAddSection,
  onEditSection,
  onError,
}: Omit<DocsTopicListProps, "t">) => {
  const { t } = useTranslation();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [sectionsByTopic, setSectionsByTopic] = useState<
    Record<string, Section[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>(
    {},
  );
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setListError(null);
        const { topics: topicsData } = await getAllTopics();
        setTopics(topicsData);

        // Fetch sections for each topic so they can be displayed underneath.
        const sectionResults = await Promise.all(
          topicsData.map(async (topic: Topic) => {
            const { sections } = await getAllSectionsByTopicId(topic.id);
            return [topic.id, sections as Section[]] as const;
          }),
        );

        const nextSectionsByTopic: Record<string, Section[]> = {};
        for (const [topicId, sections] of sectionResults) {
          nextSectionsByTopic[topicId] = sections;
        }
        setSectionsByTopic(nextSectionsByTopic);
      } catch (error) {
        console.error("Error fetching topics:", error);
        const message =
          error instanceof Error ? error.message : t("docs_loading_failed");
        setListError(message);
        onError?.(message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const handleTopicDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = topics.findIndex(
      (topic) => topic.id === String(active.id),
    );
    const newIndex = topics.findIndex((topic) => topic.id === String(over.id));

    if (oldIndex < 0 || newIndex < 0) return;

    const reorderedTopics = arrayMove(topics, oldIndex, newIndex);
    setTopics(reorderedTopics);

    try {
      await updateDocsTopicsOrder(reorderedTopics.map((topic) => topic.id));
    } catch (error) {
      console.error("Failed to reorder topics:", error);
      setTopics(topics);
      const message =
        error instanceof Error ? error.message : t("docs_topic_reorder_failed");
      onError?.(message);
    }
  };

  const handleSectionReorder = async (
    topicId: string,
    sectionIds: string[],
  ) => {
    setSectionsByTopic((prev) => {
      const current = prev[topicId] || [];
      const byId = new Map(current.map((section) => [section.id, section]));
      const reordered = sectionIds
        .map((sectionId) => byId.get(sectionId))
        .filter((section): section is Section => Boolean(section));

      return {
        ...prev,
        [topicId]: reordered,
      };
    });

    try {
      await updateDocsSectionsOrder(topicId, sectionIds);
    } catch (error) {
      console.error("Failed to reorder sections:", error);
      const { sections } = await getAllSectionsByTopicId(topicId);
      setSectionsByTopic((prev) => ({
        ...prev,
        [topicId]: sections as Section[],
      }));
      const message =
        error instanceof Error
          ? error.message
          : t("docs_section_reorder_failed");
      onError?.(message);
    }
  };

  if (loading) {
    return <div className="text-center py-4">{t("loading_topics")}</div>;
  }

  return (
    <div>
      {listError && (
        <div className="alert alert-error mb-4 text-sm">{listError}</div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleTopicDragEnd}
      >
        <SortableContext
          items={topics.map((topic) => topic.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
            {topics.map((topic) => (
              <SortableTopicItem
                key={topic.id}
                topic={topic}
                sections={sectionsByTopic[topic.id] || []}
                isExpanded={expandedTopics[topic.id] || false}
                onToggleExpand={() =>
                  setExpandedTopics((prev) => ({
                    ...prev,
                    [topic.id]: !prev[topic.id],
                  }))
                }
                onEdit={onEdit}
                onAddSection={onAddSection}
                onEditSection={onEditSection}
                onReorderSections={handleSectionReorder}
                t={t}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default DocsTopicList;
