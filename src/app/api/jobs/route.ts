import { NextResponse } from "next/server";
import { sendJobApplicationConfirmEmail } from "@/lib/server/mails";

interface JobApplicationPayload {
  name: string;
  mail: string;
  title: string;
  lang?: "en" | "da";
}

export async function POST(request: Request) {
  const { name, mail, title, lang } =
    (await request.json()) as JobApplicationPayload;

  if (!name || !mail || !title) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  try {
    await sendJobApplicationConfirmEmail(name, mail, title, lang ?? "en");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mail error:", err);
    return NextResponse.json(
      { error: "Error sending email." },
      { status: 500 }
    );
  }
}
