// app/api/estimator/route.ts
import { NextResponse } from "next/server";
import { createServerClientInstance } from "@/utils/supabase/server";
import { sendEstimatorEmail } from "@/lib/server/contact";
import { createContactRequest } from "@/lib/server/actions";
import { calculateEstimateFromAnswers } from "@/lib/server/estimate";

export async function POST(req: Request) {
  const {
    name,
    email,
    country,
    phone,
    details,
    answers,
  } = (await req.json()) as {
    name: string;
    email: string;
    country: string;
    phone: string;
    details: string;
    answers: { questionId: number; optionIds: number[] }[];
  };

  if (!name || !email || !answers?.length) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // 1) Compute estimate
  const nestedAnswers = answers.map((q) => q.optionIds);
  let estimate: string;
  try {
    estimate = await calculateEstimateFromAnswers(nestedAnswers);
  } catch (err: any) {
    console.error("Estimate computation failed:", err);
    return NextResponse.json(
      { error: "Failed to compute estimate: " + err.message },
      { status: 500 }
    );
  }

  // 2) Look up the human-readable package label from packages
  const supabase = await createServerClientInstance();
  const pkgOptId = answers.find((q) => q.questionId === 2)?.optionIds?.[0];
  let packageLabel = "Unknown package";

  if (pkgOptId) {
    // 2a) fetch the linked package UUID
    const { data: optRow, error: optErr } = await supabase
      .from("options")
      .select("package_id")
      .eq("id", pkgOptId)
      .single();
    if (!optErr && optRow?.package_id) {
      // 2b) fetch the label from packages
      const { data: pkgRow, error: pkgErr } = await supabase
        .from("packages")
        .select("label")
        .eq("id", optRow.package_id)
        .single();
      if (!pkgErr && pkgRow?.label) {
        packageLabel = pkgRow.label;
      }
    }
  }

  try {
    // 3) Persist the request
    const { requestId } = await createContactRequest(
      name,
      email,
      country,
      phone,
      answers
    );

    // 4) Send the email, now including the packageLabel
    await sendEstimatorEmail(name, email, estimate, details, packageLabel);

    return NextResponse.json({ success: true, requestId, estimate });
  } catch (err: any) {
    console.error("Estimator route error:", err);
    return NextResponse.json(
      { error: err.message || "Internal error" },
      { status: 500 }
    );
  }
}
