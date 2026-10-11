import type { APIRoute } from "astro";
import { SITE, LOCALES, CATEGORIES } from "../site.config.mjs";
import { getOpps, getGuides, isoDate } from "../lib/opps";
import { lp, type Lang } from "../i18n/ui";

export const GET: APIRoute = async () => {
  const langs = LOCALES as Lang[];
  const paths: { path: string; lastmod?: string }[] = [{ path: "/" }, { path: "/opportunities/" }, { path: "/guides/" }];
  for (const c of CATEGORIES) paths.push({ path: `/${c}/` });
  for (const o of await getOpps("en")) paths.push({ path: `/opportunities/${o.slug}/`, lastmod: isoDate(o.entry.data.published) });
  for (const g of await getGuides("en")) paths.push({ path: `/guides/${g.slug}/`, lastmod: isoDate(g.entry.data.published) });
  for (const p of ["about", "contact", "privacy", "terms"]) paths.push({ path: `/${p}/` });

  const abs = (l: Lang, p: string) => new URL(lp(l, p), SITE.url).href;
  const urls = paths.flatMap(({ path, lastmod }) =>
    langs.map((l) => `  <url>
    <loc>${abs(l, path)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}
${langs.map((a) => `    <xhtml:link rel="alternate" hreflang="${a}" href="${abs(a, path)}"/>`).join("\n")}
  </url>`)
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
};
