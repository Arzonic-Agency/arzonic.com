// src/lib/server/deepl.ts
import fetch from "node-fetch";

const DEEPL_KEY = process.env.DEEPL_API_KEY!;

interface TagOptions {
  tag_handling: string;
  non_splitting_tags: string;
}

async function translateRaw(
  text: string,
  targetLang: string,
  options?: TagOptions
): Promise<string> {
  if (targetLang === "en") return text;

  const params = new URLSearchParams({
    auth_key: DEEPL_KEY,
    text,
    target_lang: targetLang.toUpperCase(),
    ...(options?.tag_handling && { tag_handling: options.tag_handling }),
    ...(options?.non_splitting_tags && { non_splitting_tags: options.non_splitting_tags }),
  });

  const res = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    body: params,
  });
  const json = (await res.json()) as { translations: { text: string }[] };
  return json.translations.map((t) => t.text).join("\n\n");
}

export async function translateText(
  text: string,
  targetLang: string
): Promise<string> {
  return translateRaw(text, targetLang);
}

export async function translateHtml(
  html: string,
  targetLang: string
): Promise<string> {
  return translateRaw(html, targetLang, {
    tag_handling: "html",
    non_splitting_tags: [
      "br",
      "strong",
      "em",
      "p",
      "div",
      "span",
      "img",
      "a",
      "hr",
    ].join(","),
  });
}
