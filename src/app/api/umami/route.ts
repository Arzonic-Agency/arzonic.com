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

type UmamiMetricsResponse = {
  data?: UmamiMetricItem[];
};

type UmamiMetricItem = {
  x: string;
  y: number;
};

type RawMetricItem =
  | UmamiMetricItem
  | {
      url?: string;
      name?: string;
      value?: number;
      count?: number;
      x?: string;
      y?: number;
    };

const DEFAULT_ANALYTICS = {
  pageviews: 0,
  visitors: 0,
  visits: 0,
  pages: [] as UmamiMetricItem[],
  devices: [] as UmamiMetricItem[],
};

const normalizeMetricItems = (payload: unknown): UmamiMetricItem[] => {
  const entries: RawMetricItem[] = Array.isArray(payload)
    ? (payload as RawMetricItem[])
    : typeof payload === "object" &&
      payload !== null &&
      Array.isArray((payload as UmamiMetricsResponse).data)
    ? ((payload as UmamiMetricsResponse).data as RawMetricItem[])
    : [];

  return entries
    .map((item) => {
      if (typeof item !== "object" || item === null) {
        return null;
      }

      const record = item as {
        x?: string;
        url?: string;
        name?: string;
        y?: number;
        value?: number;
        count?: number;
      };

      const rawLabel = record.x ?? record.url ?? record.name ?? "";
      const rawValue = record.y ?? record.value ?? record.count ?? Number.NaN;

      if (!rawLabel) {
        return null;
      }

      return {
        x: String(rawLabel),
        y: Number.isFinite(rawValue) ? Number(rawValue) : 0,
      } satisfies UmamiMetricItem;
    })
    .filter((item): item is UmamiMetricItem => Boolean(item))
    .sort((a, b) => b.y - a.y);
};

const extractStatValue = (value: unknown): number => {
  if (typeof value === "number") return value;
  if (typeof value === "object" && value !== null && "value" in value) {
    const nested = (value as UmamiStatValue).value;
    return typeof nested === "number" ? nested : 0;
  }
  return 0;
};

const normalizeStats = (payload: unknown) => {
  if (typeof payload !== "object" || payload === null) {
    return {
      pageviews: 0,
      visitors: 0,
      visits: 0,
    };
  }

  const record = payload as Record<string, unknown>;

  return {
    pageviews: extractStatValue(
      record["pageviews"] ?? record["pageViews"] ?? record["views"]
    ),
    visitors: extractStatValue(
      record["visitors"] ?? record["uniques"] ?? record["users"]
    ),
    visits: extractStatValue(
      record["visits"] ?? record["sessions"] ?? record["total"]
    ),
  };
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
      fetchJson<UmamiStatsResponse | Record<string, unknown>>(
        `${BASE_URL}/api/websites/${WEBSITE_ID}/stats?startAt=${startAt}&endAt=${endAt}`
      ),
      fetchJson<UmamiMetricItem[] | UmamiMetricsResponse>(
        `${BASE_URL}/api/websites/${WEBSITE_ID}/metrics?startAt=${startAt}&endAt=${endAt}&type=url`
      ),
      fetchJson<UmamiMetricItem[] | UmamiMetricsResponse>(
        `${BASE_URL}/api/websites/${WEBSITE_ID}/metrics?startAt=${startAt}&endAt=${endAt}&type=device`
      ),
    ]);

    const stats = normalizeStats(statsData);

    return NextResponse.json(
      {
        pageviews: stats.pageviews,
        visitors: stats.visitors,
        visits: stats.visits,
        pages: normalizeMetricItems(pagesData),
        devices: normalizeMetricItems(devicesData),
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
