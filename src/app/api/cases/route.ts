import { NextResponse } from "next/server";
import {
  getAllCases,
  deleteCase as supaDeleteCase,
} from "@/lib/server/actions";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pageParam = url.searchParams.get("page") || "1";
    const page = parseInt(pageParam, 10);

    const result = await getAllCases(page);
    return NextResponse.json(result, { status: 200 });
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
