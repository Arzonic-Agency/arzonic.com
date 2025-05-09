import { NextResponse } from "next/server";
import { createServerClientInstance } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const { optionId } = await req.json();
  const supabase = await createServerClientInstance();

  // find the linked package UUID
  const { data: opt, error: optErr } = await supabase
    .from("options")
    .select("package_id")
    .eq("id", optionId)
    .single();
  if (optErr || !opt.package_id) {
    return NextResponse.json({ label: "Unknown package" });
  }

  // fetch its label
  const { data: pkg, error: pkgErr } = await supabase
    .from("packages")
    .select("label")
    .eq("id", opt.package_id)
    .single();
  return NextResponse.json({ label: pkgErr || !pkg ? "Unknown package" : pkg.label });
}
