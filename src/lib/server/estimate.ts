// src/lib/server/estimate.ts
import { createServerClientInstance } from "@/utils/supabase/server";

export async function calculateEstimateFromAnswers(
  answers: number[][]
): Promise<string> {
  const supabase = await createServerClientInstance();

  const packageOptionId = answers[1]?.[0];
  if (!packageOptionId) {
    throw new Error("No package selected");
  }

  const { data: optRow, error: optErr } = await supabase
    .from("options")
    .select("package_id, text")
    .eq("id", packageOptionId)
    .single();
  if (optErr) {
    throw new Error("Failed to load package mapping: " + optErr.message);
  }
  if (!optRow?.package_id) {
    throw new Error(
      `Option ${packageOptionId} (“${optRow.text}”) has no linked package`
    );
  }
  const packageId = optRow.package_id;

  const { data: pkg, error: pkgErr } = await supabase
    .from("packages")
    .select("price_eur")
    .eq("id", packageId)
    .maybeSingle();
  if (pkgErr) {
    throw new Error("DB error loading package price: " + pkgErr.message);
  }
  if (!pkg) {
    throw new Error(`No package found with id="${packageId}"`);
  }
  let price = Number(pkg.price_eur);

  const otherOptionIds = answers
    .flat()
    .filter((id): id is number => id !== packageOptionId);

  if (otherOptionIds.length) {
    const { data: opts, error: optsErr } = await supabase
      .from("options")
      .select("kind, value")
      .in("id", otherOptionIds);
    if (optsErr) {
      throw new Error("Failed to load options: " + optsErr.message);
    }

    for (const o of opts) {
      const v = Number(o.value);
      if (o.kind === "multiplier") {
        price *= v;
      } else if (o.kind === "addon") {
        price += v;
      }
    }
  }

  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(price));
}
