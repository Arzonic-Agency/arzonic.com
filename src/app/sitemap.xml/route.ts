import { createAdminClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://arzonic.com";
  const today = new Date().toISOString().split("T")[0];

  const supabase = await createAdminClient();

  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("slug, created_at") // ✅ ikke "updated_at"
    .eq("active", true);
  console.log("Jobs data:", jobs);
  console.log("Supabase error:", error);
  if (error) {
    console.error("Failed to fetch jobs for sitemap:", error.message);
  }

  const staticPaths = [
    "",
    "solutions",
    "cases",
    "about",
    "jobs",
    "contact",
    "solutions/custom-websites",
    "solutions/web-applications",
    "solutions/3d-visualization",
    "solutions/design-animation",
  ];

  const dynamicCountries = [
    "denmark",
    "sweden",
    "norway",
    "finland",
    "germany",
    "netherlands",
    "belgium",
    "ireland",
    "switzerland",
    "estonia",
    "poland",
    "czechia",
    "latvia",
    "lithuania",
    "austria",
  ];

  const urls = [
    ...staticPaths.map(
      (path) => `
    <url>
      <loc>${baseUrl}/${path}</loc>
      <changefreq>weekly</changefreq>
      <priority>${path === "" ? "1.0" : "0.8"}</priority>
      <lastmod>${today}</lastmod>
    </url>`
    ),
    ...dynamicCountries.flatMap((country) =>
      [
        "solutions/custom-websites",
        "solutions/web-applications",
        "solutions/3d-visualization",
        "solutions/design-animation",
      ].map(
        (slug) => `
      <url>
        <loc>${baseUrl}/${slug}/${country}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
        <lastmod>${today}</lastmod>
      </url>`
      )
    ),
    ...(jobs || []).map(
      (job) => `
      <url>
        <loc>${baseUrl}/jobs/${job.slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
        <lastmod>${job.updated_at?.split("T")[0] || today}</lastmod>
      </url>`
    ),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
