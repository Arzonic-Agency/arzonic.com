import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const BASE_URL = process.env.UMAMI_API_URL;
  const WEBSITE_ID = process.env.UMAMI_WEBSITE_ID;
  const ACCESS_TOKEN = process.env.UMAMI_ACCESS_TOKEN;

  if (!ACCESS_TOKEN || !BASE_URL || !WEBSITE_ID) {
    return NextResponse.json(
      { error: "Missing API credentials in .env.local" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "7d";
  const endAt = Date.now();
  const startAt =
    period === "30d"
      ? endAt - 30 * 24 * 60 * 60 * 1000
      : endAt - 7 * 24 * 60 * 60 * 1000;

  const headers = {
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

    const statsData = await statsRes.json();
    const pagesData = await pagesRes.json();
    const devicesData = await devicesRes.json();

    return NextResponse.json({
      pageviews: statsData?.pageviews?.value ?? 0,
      visitors: statsData?.visitors?.value ?? 0,
      visits: statsData?.visits?.value ?? 0,
      pages: pagesData || [],
      devices: devicesData || [],
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("🚨 API Route Error:", error.message);
      return NextResponse.json(
        { error: `Failed to fetch analytics: ${error.message}` },
        { status: 500 }
      );
    }
    console.error("🚨 API Route Error: Unknown error");
    return NextResponse.json(
      { error: "Failed to fetch analytics: Unknown error" },
      { status: 500 }
    );
  }
}
