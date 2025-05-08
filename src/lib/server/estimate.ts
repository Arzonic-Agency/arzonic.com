// src/lib/server/estimate.ts

export function calculateEstimateFromAnswers(
    answers: number[][]
  ): string {
    // 1) base price by company size (question #1 IDs 1–4)
    const Q1 = answers[0]?.[0] ?? 1;
    const sizePricing: Record<number, number> = {
      1: 1000, // Solo
      2: 2000, // 2–5
      3: 3000, // 6–15
      4: 4000, // 15+
    };
  
    // 2) project type (question #2 IDs 1–4)
    const Q2 = answers[1]?.[0] ?? 1;
    const typePricing: Record<number, number> = {
      1: 1000, // webapp
      2: 1500, // dashboard
      3: 2000, // 3D
      4: 2500, // CMS-editable
    };
  
    // 3) number of features (question #3 multiple choice)
    // charge $500 per selected feature
    const featureCount = answers[2]?.length ?? 0;
    const featurePricing = featureCount * 500;
  
    // 4) timeline adjustment (question #4 IDs 1–4)
    const Q4 = answers[3]?.[0] ?? 4;
    const timelineMultiplier: Record<number, number> = {
      1: 1.2, // <1 month
      2: 1.1, // 1–3 months
      3: 1.0, // 3–6 months
      4: 0.9, // flexible
    };
  
    // assemble
    const base =
      (sizePricing[Q1] || 0) +
      (typePricing[Q2] || 0) +
      featurePricing;
    const total = Math.round(base * (timelineMultiplier[Q4] || 1));
  
    // format as USD — adjust locale/currency to taste
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(total);
  }
  