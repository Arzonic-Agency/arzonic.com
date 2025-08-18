// src/app/api/news/route.ts
import { NextResponse } from "next/server";
import { getAllNews } from "@/lib/server/actions";

interface NewsRow {
  id: number;
  content: string;
  content_translated: string | null;
  source_lang: string;
  creator_id: string;
  created_at: string;
  images?: string[];
}

interface NewsResponse {
  id: number;
  content: string;
  creator_id: string;
  created_at: string;
  images?: string[];
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const uiLang = url.searchParams.get("lang") === "en" ? "en" : "da";

    const { news, total } = await getAllNews(page);
    const raw = news as NewsRow[];

    const transformed: NewsResponse[] = raw.map((n) => {
      // choose the right content
      const content =
        n.source_lang === uiLang
          ? n.content
          : n.content_translated ?? n.content;

      // explicitly return only the props we need
      return {
        id: n.id,
        content,
        creator_id: n.creator_id,
        created_at: n.created_at,
        images: n.images,
      };
    });

    return NextResponse.json({ news: transformed, total }, { status: 200 });
  } catch (err: unknown) {
    console.error("API GET /api/news error:", err);
    const message =
      err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
