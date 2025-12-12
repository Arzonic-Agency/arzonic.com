import { NextResponse } from "next/server";

/**
 * Umami API response types
 */

type UmamiStatValue = {
  value: number;
};

type UmamiStatsResponse = {
  pageviews: UmamiStatValue;
  visitors: UmamiStatValue;
  visits: UmamiStatValue;
};

type UmamiMetricItem = {
  x: string;
  y: number;
};

export async function GET(request: Request) {
  const BASE_URL = process.env.UMAMI_API_URL;
  const WEBSITE_ID = process.env.UMAMI_WEBSITE_ID;
  const ACCESS_TOKEN = process.env.UMAMI_ACCESS_TOKEN;

  if (!BASE_URL || !WEBSITE_ID || !ACCESS_TOKEN) {
    return NextResponse.json(
      {
        error: "Missing UMAMI_API_URL, UMAMI_WEBSITE_ID or UMAMI_ACCESS_TOKEN",
      },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? "7d";

  const endAt = Date.now();
  const startAt =
    period === "30d"
      ? endAt - 30 * 24 * 60 * 60 * 1000
      : endAt - 7 * 24 * 60 * 60 * 1000;

  const headers: HeadersInit = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    Accept: "application/json",
  };

  try {
    const [statsRes, pagesRes, devicesRes] = await Promise.all([
      fetch(
        `${BASE_URL}/api/websites/${WEBSITE_ID}/stats?startAt=${startAt}&endAt=${endAt}`,
        { headers }
      ),
      fetch(
        `${BASE_URL}/api/websites/${WEBSITE_ID}/metrics?startAt=${startAt}&endAt=${endAt}&type=url`,
        { headers }
      ),
      fetch(
        `${BASE_URL}/api/websites/${WEBSITE_ID}/metrics?startAt=${startAt}&endAt=${endAt}&type=device`,
        { headers }
      ),
    ]);

    if (!statsRes.ok || !pagesRes.ok || !devicesRes.ok) {
      throw new Error("One or more Umami API requests failed");
    }

    const statsData = (await statsRes.json()) as UmamiStatsResponse;
    const pagesData = (await pagesRes.json()) as UmamiMetricItem[];
    const devicesData = (await devicesRes.json()) as UmamiMetricItem[];

    return NextResponse.json({
      pageviews: statsData.pageviews.value,
      visitors: statsData.visitors.value,
      visits: statsData.visits.value,
      pages: pagesData,
      devices: devicesData,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Umami API error";

    console.error("🚨 Umami API route error:", message);

    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
