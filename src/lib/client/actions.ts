"use server";

import { createClient } from "@/utils/supabase/client";
import { createAdminClient } from "@/utils/supabase/server";

export async function getAllCases(page: number = 1, limit: number = 3) {
  const supabase = createClient();
  const offset = (page - 1) * limit;

  try {
    const { data, count, error } = await supabase
      .from("cases")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch cases: ${error.message}`);
    }

    return { cases: data, total: count || 0 };
  } catch (err) {
    console.error("Unexpected error during fetching cases:", err);
    throw err;
  }
}

export async function getLatestCases() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw new Error("Failed to fetch latest cases: " + error.message);
  }

  return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────────────────────────────────────

export async function getLatestReviews() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      throw new Error("Failed to fetch latest reviews: " + error.message);
    }

    return data;
  } catch (err) {
    console.error("Unexpected error during fetching reviews:", err);
    throw err;
  }
}

export async function createRequest(
  name: string,
  company: string,
  mobile: string,
  mail: string,
  category: string,
  consent: boolean,
  message: string
): Promise<void> {
  const supabase = createClient();

  try {
    const ipResponse = await fetch("https://api64.ipify.org?format=json");
    const ipData = await ipResponse.json();
    const ipAddress = ipData.ip;

    const consentTimestamp = consent ? new Date().toISOString() : null;
    const { error } = await supabase.from("requests").insert([
      {
        name,
        company,
        mobile,
        mail,
        category,
        consent,
        message,
        consent_timestamp: consentTimestamp,
        ip_address: ipAddress,
        terms_version: "v1.0",
      },
    ]);

    if (error) {
      throw new Error(`Failed to create request: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in createRequest:", error);
    throw error;
  }
}
export async function createContactRequest(
  name: string,
  email: string,
  country: string,
  mobile: string,
  answers: { questionId: number; optionIds: number[] }[],
  consentChecked: boolean
): Promise<{ requestId: string }> {
  const supabase = await createAdminClient();

  const { data: request, error: reqErr } = await supabase
    .from("requests")
    .insert({
      name,
      mail: email,
      country,
      mobile,
      consent: consentChecked,
    })
    .select("id")
    .single();

  if (reqErr || !request) {
    throw new Error("Failed to create request: " + reqErr?.message);
  }

  const requestId = request.id;

  const { error: respErr } = await supabase
    .from("responses")
    .insert({ request_id: requestId, answers });

  if (respErr) {
    throw new Error("Failed to save responses: " + respErr.message);
  }

  return { requestId };
}

export type Option = { id: number; text: string };
export type EstimatorQuestion = {
  id: number;
  text: string;
  type: "single" | "multiple";
  options: Option[];
};
export async function getEstimatorQuestions(
  lang: "en" | "da" = "en"
): Promise<EstimatorQuestion[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("questions")
    .select(
      `
      id,
      text,
      text_translated,
      type,
      options (
        id,
        text,
        text_translated
      )
    `
    )
    .order("id", { ascending: true })
    .order("id", { referencedTable: "options", ascending: true });

  if (error) {
    console.error("Failed to fetch estimator questions:", error.message);
    throw new Error("Failed to fetch questions: " + error.message);
  }

  return (data || []).map(
    (q: {
      id: number;
      text: string;
      text_translated?: string;
      type: "single" | "multiple";
      options: {
        id: number;
        text: string;
        text_translated?: string;
      }[];
    }) => ({
      id: q.id,
      text: lang === "da" && q.text_translated ? q.text_translated : q.text,
      type: q.type,
      options: q.options.map(
        (o: { id: number; text: string; text_translated?: string }) => ({
          id: o.id,
          text:
            lang === "da" && o.text_translated
              ? o.text_translated
              : o.text,
        })
      ),
    })
  );
}
