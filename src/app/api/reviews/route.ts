import { NextResponse } from "next/server";
import {
  getAllReviews,
  deleteReview as supaDeleteReview,
} from "@/lib/server/actions";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const lang = url.searchParams.get("lang") === "en" ? "en" : "da";

    const { reviews, total } = await getAllReviews(page);

    const transformed = reviews.map((r: any) => {
      const original = r.desc;
      const translated = r.desc_translated;
      const description =
        r.source_lang === lang ? original : (translated ?? original);
      return { ...r, description };
    });

    return NextResponse.json({ reviews: transformed, total }, { status: 200 });
  } catch (err: any) {
    console.error("API GET /api/reviews error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { reviewId } = (await request.json()) as { reviewId: number };
    await supaDeleteReview(reviewId);
    return new NextResponse(null, { status: 204 });
  } catch (err: any) {
    console.error("API DELETE /api/reviews error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
