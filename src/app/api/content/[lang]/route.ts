import path from "path";
import fs from "fs/promises";
import { CONTENT_PATH } from "@/lib/env";
import { NextRequest } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { lang: string } }
) {
  const lang = params.lang || "da";
  const filePath = path.join(CONTENT_PATH, `${lang}.json`);

  try {
    const data = await fs.readFile(filePath, "utf-8");

    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Kunne ikke læse oversættelse:", err);
    return new Response(
      JSON.stringify({ error: "Translation file not found or invalid" }),
      { status: 500 }
    );
  }
}
