import path from "path";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

const fallbackPath = path.join(process.cwd(), "localess");

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const lang = url.pathname.split("/").pop() || "da";

  let filePath = path.join(
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
  } catch (e) {
    try {
      const fallbackFile = path.join(fallbackPath, `${lang}.json`);
      const data = await fs.readFile(fallbackFile, "utf-8");
      return new NextResponse(data, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error(
        "Ingen oversættelse fundet i hverken public/data eller fallback:",
        err
      );
      return NextResponse.json(
        { error: "Translation not found" },
        { status: 500 }
      );
    }
  }
}
