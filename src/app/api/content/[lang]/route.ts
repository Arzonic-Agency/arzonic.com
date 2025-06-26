import path from "path";
import fs from "fs/promises";
import { CONTENT_PATH } from "@/lib/env";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { lang: string } }
) {
  const lang = params.lang || "da"; // fallback hvis ikke sat
  const filePath = path.join(CONTENT_PATH, `${lang}.json`);

  try {
    const data = await fs.readFile(filePath, "utf-8");

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Kunne ikke læse oversættelse:", err);
    return new NextResponse(
      JSON.stringify({ error: "Translation file not found or invalid" }),
      { status: 500 }
    );
  }
}
