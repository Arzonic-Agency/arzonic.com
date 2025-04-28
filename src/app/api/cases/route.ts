// src/app/api/cases/route.ts
import { NextResponse } from "next/server";
import { getAllCases } from "@/lib/server/actions";

interface CaseRow {
  id: number;
  companyName: string;
  desc: string;
  desc_translated: string | null;
  source_lang: string;           // e.g. "en" or "da"
  city: string;
  country: string;
  country_translated: string | null;
  contactPerson: string;
  image: string | null;
  creator_id: string;
  created_at: string;
}

interface CaseResponse
  extends Omit<
    CaseRow,
    | "desc"
    | "desc_translated"
    | "source_lang"
    | "country"
    | "country_translated"
  > {
  description: string;
  countryName: string;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const rawLang = url.searchParams.get("lang")?.toLowerCase();
    const uiLang = rawLang === "en" ? "en" : "da";

    const { cases, total } = await getAllCases(page);
    const raw = cases as CaseRow[];

    const transformed: CaseResponse[] = raw.map((c) => {
      const description =
        c.source_lang === uiLang
          ? c.desc
          : c.desc_translated ?? c.desc;

      const countryName =
        uiLang === "en"
          ? c.country_translated ?? c.country
          : c.country;

      // rename omitted fields to underscore-prefixed to suppress "unused" lint
      const {
        desc: _desc,
        desc_translated: _desc_translated,
        source_lang: _source_lang,
        country: _country,
        country_translated: _country_translated,
        ...rest
      } = c;

      return {
        ...rest,
        description,
        countryName,
      };
    });

    return NextResponse.json({ cases: transformed, total }, { status: 200 });
  } catch (err: unknown) {
    console.error("API GET /api/cases error:", err);
    const message =
      err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
