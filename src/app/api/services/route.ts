import { createServerClientInstance } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServerClientInstance();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("label", { ascending: true });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ services: data });
}
