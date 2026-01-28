"use client";

import { useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

export type NewsSocialStatus = "pending" | "processing" | "completed" | "partial" | null;

export type NewsUpdate = {
  id: number;
  social_status?: NewsSocialStatus;
  sharedFacebook?: boolean;
  sharedInstagram?: boolean;
  linkFacebook?: string | null;
  linkInstagram?: string | null;
};

export function useNewsRealtime(
  newsId: number | null,
  onStatusUpdate?: (update: NewsUpdate) => void
) {
  const supabase = createClient();

  const handleUpdate = useCallback(
    (payload: { new: NewsUpdate }) => {
      console.log("News status update received:", payload.new);
      if (onStatusUpdate) {
        onStatusUpdate(payload.new);
      }
    },
    [onStatusUpdate]
  );

  useEffect(() => {
    if (!newsId) return;

    const channel = supabase
      .channel(`news-${newsId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "news",
          filter: `id=eq.${newsId}`,
        },
        handleUpdate
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [newsId, supabase, handleUpdate]);
}

// Hook for listening to all news updates (useful for news list)
export function useNewsListRealtime(
  onNewsUpdate?: (update: NewsUpdate) => void,
  onNewsInsert?: (news: NewsUpdate) => void
) {
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("news-list-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "news",
        },
        (payload) => {
          console.log("News update in list:", payload.new);
          if (onNewsUpdate) {
            onNewsUpdate(payload.new as NewsUpdate);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "news",
        },
        (payload) => {
          console.log("New news inserted:", payload.new);
          if (onNewsInsert) {
            onNewsInsert(payload.new as NewsUpdate);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, onNewsUpdate, onNewsInsert]);
}
