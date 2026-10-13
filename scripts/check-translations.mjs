// Warns about English listings that have no Arabic or Pashto version yet,
// about listings without a language requirement,
// and about translations whose shared fields (links, dates, codes) differ from English.
// Runs before every build (npm "prebuild"). It only warns: a missing translation
// falls back to English on the site, so the build never fails because of it.
// Usage: node scripts/check-translations.mjs [--strict]   (--strict exits 1 on problems)
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const LANGS = ["ar", "ps"];
// Fields that must be identical in every language (i18n: duplicate in public/admin/config.yml).
const SHARED = {
  opportunities: ["category", "image", "hostUrl", "officialUrl", "countryCode", "levels", "funding", "deadline", "link", "published", "featured", "sample", "draft"],
  guides: ["topic", "published", "readingMinutes", "draft"],
};

function frontmatter(file) {
  const m = readFileSync(file, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const out = {};
  if (!m) return out;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z]\w*):\s*(.*)$/);
    if (kv) out[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

let problems = 0;
for (const [collection, shared] of Object.entries(SHARED)) {
  const base = join("src/content", collection);
  const enDir = join(base, "en");
  if (!existsSync(enDir)) continue;
  for (const name of readdirSync(enDir).filter((f) => f.endsWith(".md"))) {
    const en = frontmatter(join(enDir, name));
    if (en.draft === "true") continue;
    if (collection === "opportunities" && !en.language) {
      problems++;
      console.warn(`[translations] ${collection}/en/${name} has no "language" requirement (Abdou's rule: every page shows it)`);
    }
    for (const lang of LANGS) {
      const file = join(base, lang, name);
      if (!existsSync(file)) {
        // Guides are translated when practical; only opportunities count as problems.
        if (collection === "opportunities") problems++;
        console.warn(`[translations] ${collection}/${lang}/${name} is missing (English is shown instead)`);
        continue;
      }
      const tr = frontmatter(file);
      for (const key of shared) {
        if ((en[key] ?? "") !== (tr[key] ?? "")) {
          problems++;
          console.warn(`[translations] ${collection}/${lang}/${name}: "${key}" differs from English (${tr[key] ?? "empty"} vs ${en[key] ?? "empty"})`);
        }
      }
    }
  }
}

if (problems) console.warn(`[translations] ${problems} opportunity translation problem(s). See docs/CONTENT-RULES.md, "Translations".`);
else console.log("[translations] Every opportunity has English, Arabic and Pashto versions.");
if (problems && process.argv.includes("--strict")) process.exit(1);
