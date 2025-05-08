import { NextResponse } from "next/server"
import { sendEstimatorEmail } from "@/lib/server/contact"
import { createContactRequest } from "@/lib/server/actions"

export async function POST(req: Request) {
  const {
    name,
    email,
    country,
    phone,
    estimate,
    details,
    answers,
  } = (await req.json()) as {
    name: string
    email: string
    country: string
    phone: string
    estimate: string
    details: string
    answers: { questionId: number; optionIds: number[] }[]
  }

  if (!name || !email || !estimate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    // 1) Persist request + responses JSONB
    const { requestId } = await createContactRequest(
      name,
      email,
      country,
      phone,
      answers
    )

    // 2) Fire off your custom estimator mail
    await sendEstimatorEmail(name, email, estimate, details)

    return NextResponse.json({ success: true, requestId })
  } catch (err: any) {
    console.error("Estimator route error:", err)
    return NextResponse.json(
      { error: err.message || "Internal error" },
      { status: 500 }
    )
  }
}
