import path from "path";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { CONTENT_PATH } from "@/lib/env";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const segments = url.pathname.split("/");
  const lang = segments[segments.length - 1] || "da"; // get [lang] from URL

  const filePath = path.join(
    process.cwd(),
    "public/data/content",
    `${lang}.json`
  );

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
    return NextResponse.json(
      { error: "Translation file not found or invalid" },
      { status: 500 }
    );
  }
}
