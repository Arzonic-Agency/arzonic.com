// src/app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { getAllReviews } from "@/lib/server/actions";

interface ReviewRow {
  id: number;
  creator: string;
  desc: string;
  city: string;
  desc_translated: string | null;
  source_lang: string;
  rate: number;
  company: string;
  contactPerson: string;
  created_at: string;
}

interface ReviewResponse extends ReviewRow {
  desc: string;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const lang = url.searchParams.get("lang") === "en" ? "en" : "da";

    const { reviews, total } = await getAllReviews(page);
    const raw = reviews as ReviewRow[];

    const transformed: ReviewResponse[] = raw.map((r) => {
      const original = r.desc;
      const translated = r.desc_translated;
      const desc = r.source_lang === lang ? original : translated ?? original;

      return {
        ...r,
        desc,
      };
    });

    return NextResponse.json({ reviews: transformed, total }, { status: 200 });
  } catch (err: unknown) {
    console.error("API GET /api/reviews error:", err);
    const message =
      err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
