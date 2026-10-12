import { getCollection, type CollectionEntry } from "astro:content";
import type { Lang } from "../i18n/ui";

export type Opp = {
  slug: string;
  entry: CollectionEntry<"opportunities">;
  translated: boolean;
  /** English country name, used as a stable filter value in every language. */
  countryKey: string;
};

/** Every published opportunity in a language. Listings without a translation fall back to English. */
export async function getOpps(lang: Lang): Promise<Opp[]> {
  const all = await getCollection("opportunities", (e) => !e.data.draft);
  const byLang = new Map<string, Map<string, CollectionEntry<"opportunities">>>();
  for (const e of all) {
    const [l, ...rest] = e.id.split("/");
    const slug = rest.join("/");
    if (!byLang.has(l)) byLang.set(l, new Map());
    byLang.get(l)!.set(slug, e);
  }
  const en = byLang.get("en") ?? new Map();
  const local = byLang.get(lang) ?? new Map();
  const out: Opp[] = [];
  for (const [slug, base] of en) {
    const tr = lang === "en" ? undefined : local.get(slug);
    out.push({ slug, entry: tr ?? base, translated: lang === "en" || !!tr, countryKey: base.data.country });
  }
  return out.sort((a, b) => +b.entry.data.published - +a.entry.data.published);
}

export const isoDate = (d?: Date | null) => (d ? d.toISOString().slice(0, 10) : "");

export function formatDate(d: Date, lang: Lang) {
  const locale = lang === "ar" ? "ar-EG" : lang === "ps" ? "ps-AF" : "en-GB";
  return d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export type Guide = { slug: string; entry: CollectionEntry<"guides">; translated: boolean };

/** Every published guide in a language, newest first. Untranslated guides fall back to English. */
export async function getGuides(lang: Lang): Promise<Guide[]> {
  const all = await getCollection("guides", (e) => !e.data.draft);
  const find = (l: string, slug: string) => all.find((e) => e.id === `${l}/${slug}`);
  return all
    .filter((e) => e.id.startsWith("en/"))
    .map((base) => {
      const slug = base.id.slice(3);
      const tr = lang === "en" ? undefined : find(lang, slug);
      return { slug, entry: tr ?? base, translated: lang === "en" || !!tr };
    })
    .sort((a, b) => +b.entry.data.published - +a.entry.data.published);
}

/** Languages that have a real translation of a listing or guide (English always counts). */
export async function translatedLangs(collection: "opportunities" | "guides", slug: string): Promise<Lang[]> {
  const all = await getCollection(collection, (e) => !e.data.draft);
  const ids = new Set(all.map((e) => e.id));
  return (["en", "ar", "ps"] as Lang[]).filter((l) => l === "en" || ids.has(`${l}/${slug}`));
}
