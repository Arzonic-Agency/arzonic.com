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
// JOBS
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllActiveJobs() {
  const supabase = createClient();

  try {
    const { data, count, error } = await supabase
      .from("jobs")
      .select("*", { count: "exact" })
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(
        `Failed to fetch requests: ${error.message || "Unknown error"}`
      );
    }

    return { requests: data || [], total: count || 0 };
  } catch (err) {
    console.error("Unexpected error during fetching requests:", err);
    throw err;
  }
}

export async function getJobBySlug(slug: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    console.error("Job fetch error:", error.message);
    return null;
  }

  return data;
}

export async function deactivateExpiredJobs() {
  const supabase = await createAdminClient();

  const { error } = await supabase.rpc("update_job_active_status");

  if (error) {
    console.error("Fejl ved deaktivering af jobs:", error.message);
    throw new Error("Kunne ikke deaktivere jobs");
  }

  return { success: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// JOBS APPLY
// ─────────────────────────────────────────────────────────────────────────────

export async function createApplication({
  job_id,
  name,
  mobile,
  mail,
  consent,
  slug,
  cv,
  application,
}: {
  job_id: string;
  name: string;
  mobile: string;
  mail: string;
  consent: boolean;
  slug: string;
  cv: File;
  application: File;
}): Promise<{ success: boolean; message?: string }> {
  const supabase = createClient();

  const sanitize = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

  const safeName = sanitize(name);
  const id = Math.floor(1000 + Math.random() * 9000);
  const cvPath = `cv/${slug}_${id}_${safeName}.pdf`;
  const applicationPath = `application/${slug}_${id}_${safeName}.pdf`;

  try {
    // 1) Tjek om mail allerede har søgt
    const { data: mailExists, error: mailError } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", job_id)
      .eq("mail", mail)
      .maybeSingle();

    if (mailError) {
      console.error("❌ DB check error (mail):", mailError.message);
      return { success: false, message: "generic" };
    }

    if (mailExists) {
      return { success: false, message: "mail-already-applied" };
    }

    // 2) Tjek om mobil allerede har søgt
    const { data: mobileExists, error: mobileError } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", job_id)
      .eq("mobile", mobile)
      .maybeSingle();

    if (mobileError) {
      console.error("❌ DB check error (mobile):", mobileError.message);
      return { success: false, message: "generic" };
    }

    if (mobileExists) {
      return { success: false, message: "mobile-already-applied" };
    }

    // 3) Hent IP
    let ip = "unknown";
    try {
      ip = await fetch("https://api64.ipify.org?format=json")
        .then((res) => res.json())
        .then((data) => data.ip);
    } catch (ipErr) {
      console.warn("⚠️ IP fetch failed:", ipErr);
    }

    // 4) Insert i DB
    const { error: insertError } = await supabase.from("applications").insert({
      job_id,
      name,
      mobile,
      mail,
      consent,
      consent_timestamp: new Date().toISOString(),
      ip_address: ip,
      cv: cvPath,
      application: applicationPath,
    });

    if (insertError) {
      if (insertError.code === "23505") {
        if (insertError.message.includes("unique_mail_per_job")) {
          return { success: false, message: "mail-already-applied" };
        }
        if (insertError.message.includes("unique_mobile_per_job")) {
          return { success: false, message: "mobile-already-applied" };
        }
      }

      throw new Error(insertError.message);
    }

    // 5) Upload filer EFTER insert
    const { error: cvErr } = await supabase.storage
      .from("applications-files")
      .upload(cvPath, cv, { upsert: false });

    if (cvErr) throw new Error("CV upload failed");

    const { error: appErr } = await supabase.storage
      .from("applications-files")
      .upload(applicationPath, application, { upsert: false });

    if (appErr) throw new Error("Application upload failed");

    return { success: true };
  } catch (err: unknown) {
    console.error("❌ createApplication:", (err as Error).message);

    return {
      success: false,
      message:
        (err as Error).message === "mail-already-applied" ||
        (err as Error).message === "mobile-already-applied"
          ? (err as Error).message
          : (err as Error).message || "generic",
    };
  }
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
          text: lang === "da" && o.text_translated ? o.text_translated : o.text,
        })
      ),
    })
  );
}

export async function getPackages() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .order("price_eur", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch packages: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error("Unexpected error during fetching packages:", err);
    throw err;
  }
}

export async function getExtraServices() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("price_dkk", { ascending: true });

  if (error)
    throw new Error(`Failed to fetch extra services: ${error.message}`);
  return data;
}

export async function getModelUrl(fileName: string): Promise<string> {
  const supabase = createClient();

  try {
    const { data, error } = supabase.storage
      .from("models")
      .getPublicUrl(fileName) as {
      data: { publicUrl: string } | null;
      error: Error | null; // Changed from `any` to `Error`
    };

    if (error || !data) {
      throw new Error(
        `Failed to fetch model URL: ${error?.message || "Unknown error"}`
      );
    }

    return data.publicUrl;
  } catch (err) {
    console.error("Unexpected error during fetching model URL:", err);
    throw err;
  }
}
