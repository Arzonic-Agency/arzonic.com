import { NextResponse } from "next/server";
import { getAllCases } from "@/lib/server/actions";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const rawLang = url.searchParams.get("lang")?.toLowerCase();
    const uiLang = rawLang === "en" ? "en" : "da";
    const { cases, total } = await getAllCases(page);

    const transformed = cases.map(
      (c: {
        desc: string;
        desc_translated: string | null;
        source_lang: string;
      }) => {
        const original = c.desc;
        const translated = c.desc_translated;

        const description =
          c.source_lang === uiLang ? original : translated ?? original;
        return {
          ...c,
          description,
        };
      }
    );

    return NextResponse.json({ cases: transformed, total }, { status: 200 });
  } catch (err: unknown) {
    console.error("API GET /api/cases error:", err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}
