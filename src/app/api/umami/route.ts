import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const BASE_URL = process.env.UMAMI_API_URL;
  const WEBSITE_ID = process.env.UMAMI_WEBSITE_ID;
  const ACCESS_TOKEN = process.env.UMAMI_ACCESS_TOKEN;

  if (!ACCESS_TOKEN || !BASE_URL || !WEBSITE_ID) {
    return NextResponse.json(
      { error: "Missing API credentials in environment variables" },
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

  const headers: HeadersInit = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    Accept: "application/json",
  };

  try {
    const [statsRes, pagesRes, devicesRes] = await Promise.all([
      fetch(
        `${BASE_URL}/api/websites/${WEBSITE_ID}/stats?startAt=${startAt}&endAt=${endAt}`,
        { headers, cache: "no-store" }
      ),
      fetch(
        `${BASE_URL}/api/websites/${WEBSITE_ID}/metrics?startAt=${startAt}&endAt=${endAt}&type=url`,
        { headers, cache: "no-store" }
      ),
      fetch(
        `${BASE_URL}/api/websites/${WEBSITE_ID}/metrics?startAt=${startAt}&endAt=${endAt}&type=device`,
        { headers, cache: "no-store" }
      ),
    ]);

    // Gør fejl synlige (i stedet for “0 data” uden forklaring)
    if (!statsRes.ok) {
      const txt = await statsRes.text().catch(() => "");
      return NextResponse.json(
        { error: `Umami stats request failed (${statsRes.status}): ${txt}` },
        { status: 500 }
      );
    }
    if (!pagesRes.ok) {
      const txt = await pagesRes.text().catch(() => "");
      return NextResponse.json(
        { error: `Umami pages request failed (${pagesRes.status}): ${txt}` },
        { status: 500 }
      );
    }
    if (!devicesRes.ok) {
      const txt = await devicesRes.text().catch(() => "");
      return NextResponse.json(
        {
          error: `Umami devices request failed (${devicesRes.status}): ${txt}`,
        },
        { status: 500 }
      );
    }

    const statsData: any = await statsRes.json();
    const pagesData: any = await pagesRes.json();
    const devicesData: any = await devicesRes.json();

    return NextResponse.json({
      pageviews: Number(statsData?.pageviews?.value ?? 0),
      visitors: Number(statsData?.visitors?.value ?? 0),
      visits: Number(statsData?.visits?.value ?? 0),
      pages: Array.isArray(pagesData) ? pagesData : [],
      devices: Array.isArray(devicesData) ? devicesData : [],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("🚨 API Route Error:", message);
    return NextResponse.json(
      { error: `Failed to fetch analytics: ${message}` },
      { status: 500 }
    );
  }
}
