// Listings and guides for the chat assistant, one small JSON file per language.
// The assistant downloads it only when a visitor opens the chat, so pages stay light.
import type { APIRoute } from "astro";
import { LOCALES } from "../../site.config.mjs";
import { getOpps, getGuides, isoDate } from "../../lib/opps";
import { lp, type Lang } from "../../i18n/ui";

export function getStaticPaths() {
  return (LOCALES as Lang[]).map((lang) => ({ params: { lang } }));
}

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as Lang;
  const opps = (await getOpps(lang)).map(({ slug, entry, countryKey }) => {
    const d = entry.data;
    return {
      u: lp(lang, `/opportunities/${slug}/`),
      t: d.title,
      s: d.summary,
      h: d.host || "",
      cat: d.category,
      k: countryKey,
      c: d.country,
      cc: (d.countryCode || "").toLowerCase(),
      lv: d.levels,
      f: d.funding,
      e: d.eligible,
      d: isoDate(d.deadline),
    };
  });
  const guides = (await getGuides(lang)).map(({ slug, entry }) => ({ slug, u: lp(lang, `/guides/${slug}/`), t: entry.data.title }));
  return new Response(JSON.stringify({ opps, guides }), { headers: { "Content-Type": "application/json" } });
};
