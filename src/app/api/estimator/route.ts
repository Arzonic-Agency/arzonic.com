import { NextResponse } from "next/server";
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

  // compute the estimate on the server
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

  try {
    // persist contact request
    const { requestId } = await createContactRequest(
      name,
      email,
      country,
      phone,
      answers
    );

    // send the email
    await sendEstimatorEmail(name, email, estimate, details);

    return NextResponse.json({ success: true, requestId, estimate });
  } catch (err: any) {
    console.error("Estimator route error:", err);
    return NextResponse.json(
      { error: err.message || "Internal error" },
      { status: 500 }
    );
  }
}
