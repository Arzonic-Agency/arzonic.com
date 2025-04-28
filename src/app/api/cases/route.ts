// src/app/api/cases/route.ts
import { NextResponse } from "next/server";
import { getAllCases } from "@/lib/server/actions";

interface CaseRow {
  id: number;
  companyName: string;
  desc: string;
  desc_translated: string | null;
  source_lang: string;           // "en" or "da"
  city: string;
  country: string;
  country_translated: string | null;
  contactPerson: string;
  image: string | null;
  creator_id: string;
  created_at: string;
}

interface CaseResponse {
  id: number;
  companyName: string;
  city: string;
  contactPerson: string;
  image: string | null;
  creator_id: string;
  created_at: string;
  description: string;
  countryName: string;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const uiLang = url.searchParams.get("lang") === "en" ? "en" : "da";

    const { cases, total } = await getAllCases(page);
    const raw = cases as CaseRow[];

    const transformed: CaseResponse[] = raw.map((c) => {
      // choose the right description
      const description =
        c.source_lang === uiLang
          ? c.desc
          : c.desc_translated ?? c.desc;

      // choose the right country name
      const countryName =
        uiLang === "en"
          ? c.country_translated ?? c.country
          : c.country;

      // explicitly return only the props we need
      return {
        id: c.id,
        companyName: c.companyName,
        city: c.city,
        contactPerson: c.contactPerson,
        image: c.image,
        creator_id: c.creator_id,
        created_at: c.created_at,
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
