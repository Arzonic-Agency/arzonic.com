import { createServerClientInstance } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServerClientInstance();
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .order("price", { ascending: true });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ packs: data });
}
