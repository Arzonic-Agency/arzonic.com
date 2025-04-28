// src/app/api/cases/route.ts
import { NextResponse } from "next/server";
import { getAllCases } from "@/lib/server/actions";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const rawLang = url.searchParams.get("lang")?.toLowerCase();
    const uiLang = rawLang === "en" ? "en" : "da";

    const { cases, total } = await getAllCases(page);

    const transformed = cases.map((c: any) => {
      const {
        desc,
        desc_translated,
        source_lang,
        country,
        country_translated,
        ...rest
      } = c;

      const description =
        source_lang === uiLang ? desc : desc_translated ?? desc;

      const countryName =
        uiLang === "en" ? country_translated ?? country : country;

      return {
        ...rest,
        description,
        countryName,
      };
    });

    return NextResponse.json({ cases: transformed, total }, { status: 200 });
  } catch (err: unknown) {
    console.error("API GET /api/cases error:", err);
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
