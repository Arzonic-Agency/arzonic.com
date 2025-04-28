import { NextResponse } from "next/server";
import {
  getAllCases,
  deleteCase as supaDeleteCase,
} from "@/lib/server/actions";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const rawLang = url.searchParams.get("lang")?.toLowerCase();
    const uiLang = rawLang === "en" ? "en" : "da";
    const { cases, total } = await getAllCases(page);

    const transformed = cases.map((c: any) => {
      const original = c.desc;
      const translated = c.desc_translated;

      const description =
        c.source_lang === uiLang
          ? original
          : (translated ?? original);
      return {
        ...c,
        description,
      };
    });

    return NextResponse.json({ cases: transformed, total }, { status: 200 });
  } catch (err: any) {
    console.error("API GET /api/cases error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { caseId } = (await request.json()) as { caseId: number };
    await supaDeleteCase(caseId);
    return new NextResponse(null, { status: 204 });
  } catch (err: any) {
    console.error("API DELETE /api/cases error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
