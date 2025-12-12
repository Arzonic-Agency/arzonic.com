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

const DEFAULT_ANALYTICS = {
  pageviews: 0,
  visitors: 0,
  visits: 0,
  pages: [] as UmamiMetricItem[],
  devices: [] as UmamiMetricItem[],
};

export async function GET(request: Request) {
  const BASE_URL = process.env.UMAMI_API_URL;
  const WEBSITE_ID = process.env.UMAMI_WEBSITE_ID;
  const ACCESS_TOKEN = process.env.UMAMI_ACCESS_TOKEN;

  if (!BASE_URL || !WEBSITE_ID || !ACCESS_TOKEN) {
    console.warn(
      "Umami analytics disabled: missing UMAMI_API_URL, UMAMI_WEBSITE_ID or UMAMI_ACCESS_TOKEN"
    );
    return NextResponse.json(DEFAULT_ANALYTICS);
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
    const fetchJson = async <T>(url: string) => {
      const res = await fetch(url, { headers });
      if (!res.ok) {
        console.warn(`Umami request failed: ${res.status} ${url}`);
        return null;
      }
      try {
        return (await res.json()) as T;
      } catch (parseError) {
        console.warn(`Failed to parse Umami response for ${url}`, parseError);
        return null;
      }
    };

    const [statsData, pagesData, devicesData] = await Promise.all([
      fetchJson<UmamiStatsResponse>(
        `${BASE_URL}/api/websites/${WEBSITE_ID}/stats?startAt=${startAt}&endAt=${endAt}`
      ),
      fetchJson<UmamiMetricItem[]>(
        `${BASE_URL}/api/websites/${WEBSITE_ID}/metrics?startAt=${startAt}&endAt=${endAt}&type=url`
      ),
      fetchJson<UmamiMetricItem[]>(
        `${BASE_URL}/api/websites/${WEBSITE_ID}/metrics?startAt=${startAt}&endAt=${endAt}&type=device`
      ),
    ]);

    return NextResponse.json(
      {
        pageviews: statsData?.pageviews?.value ?? 0,
        visitors: statsData?.visitors?.value ?? 0,
        visits: statsData?.visits?.value ?? 0,
        pages: Array.isArray(pagesData) ? pagesData : [],
        devices: Array.isArray(devicesData) ? devicesData : [],
      },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Umami API error";

    console.error("🚨 Umami API route error:", message);

    return NextResponse.json(
      { ...DEFAULT_ANALYTICS, error: message },
      { status: 200 }
    );
  }
}
