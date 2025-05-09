// src/lib/server/deepl.ts
import fetch from "node-fetch";

const DEEPL_KEY = process.env.DEEPL_API_KEY!;

export async function translate(text: string, targetLang: string): Promise<string> {
  if (targetLang === "en") return text;        // no-op for English
  const params = new URLSearchParams({
    auth_key: DEEPL_KEY,
    text,
    target_lang: targetLang.toUpperCase(),
  });
  const res = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    body: params,
  });
  const json = await res.json() as { translations: { text: string }[] };
  return json.translations.map((t) => t.text).join("\n\n");
}
