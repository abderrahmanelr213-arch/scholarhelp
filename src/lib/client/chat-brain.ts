// The chat assistant's "brain": reads a visitor's question in English, Arabic or Pashto and decides
// what to answer. Everything runs in the browser from the site's own listings, with no AI service.

export type ChatOpp = { u: string; t: string; s: string; h: string; cat: string; k: string; c: string; cc: string; lv: string[]; f: string; e: string; d: string };
export type ChatGuide = { slug: string; u: string; t: string };
export type ChatData = { opps: ChatOpp[]; guides: ChatGuide[] };
export type Filters = { cat?: string; level?: string; country?: string; countryCode?: string; funding?: string; soon?: boolean; openAll?: boolean };
export type Answer =
  | { kind: "greet" | "thanks" | "fallback" | "countries" | "levels" }
  | { kind: "faq"; key: string; opps?: ChatOpp[] }
  | { kind: "results"; filters: Filters; opps: ChatOpp[]; total: number; missingCountry?: string; closest?: boolean };

/** Lowercase, strip Arabic diacritics and unify letter variants (Arabic and Pashto), drop punctuation. */
export function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[ً-ْٰـ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/[ىیېۍ]/g, "ي")
    .replace(/ک/g, "ك")
    .replace(/ؤ/g, "و")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

const ARABIC = /[؀-ۿ]/;
/** A word plus its forms without Arabic prefixes (و، ب، ل، ك، ف and ال), so "بالمانيا" matches "المانيا". */
function forms(w: string): string[] {
  if (!ARABIC.test(w)) return [w];
  const out = new Set([w]);
  const a = w.replace(/^[وفبلك](?=..)/, "");
  out.add(a);
  for (const x of [w, a]) if (x.startsWith("ال") && x.length > 3) out.add(x.slice(2));
  if (w.startsWith("لل") && w.length > 4) out.add(w.slice(2));
  return [...out];
}

/** Does the phrase appear in the tokens? A keyword ending in * matches any word starting with it. */
function hasPhrase(tokens: string[], phrase: string): number {
  const parts = norm(phrase.replace(/\*$/, "")).split(" ");
  const stem = phrase.endsWith("*");
  for (let i = 0; i + parts.length <= tokens.length; i++) {
    let ok = true;
    for (let j = 0; j < parts.length && ok; j++) {
      const tf = forms(tokens[i + j]);
      const pf = forms(parts[j]);
      const last = j === parts.length - 1;
      ok = tf.some((t) => pf.some((p) => t === p || (stem && last && t.startsWith(p))));
    }
    if (ok) return i;
  }
  return -1;
}
const findAny = (tokens: string[], list: string[]) => list.find((k) => hasPhrase(tokens, k) >= 0);

// Keywords in English, Arabic and Pashto. Stems end with *.
const CATS: Record<string, string[]> = {
  conferences: ["conferenc*", "summit*", "forum*", "symposium*", "congress*", "مؤتمر*", "قمه", "منتدي*", "ملتقي*", "كنفرانس*"],
  exchange: ["exchang*", "cultural", "summer school*", "youth program*", "تبادل*", "ثقافي*", "كلتوري", "مدرسه صيفيه"],
  scholarships: ["scholarship*", "bursar*", "fellowship*", "منحه", "منح", "منحات", "بعثه", "بعثات", "بورس*", "سكالرشپ"],
};
const LEVELS: Record<string, string[]> = {
  Postdoc: ["postdoc*", "post doc*", "ما بعد الدكتوراه", "بعد الدكتوراه", "ما بعد الدكتوراة"],
  Bachelor: ["bachelor*", "undergrad*", "licence", "license", "bsc", "بكالوريوس", "بكالوريا", "ليسانس", "لسانس", "اجازه"],
  Master: ["master*", "msc", "mba", "ماجستير", "ماجيستير", "ماستر", "ماسټر*", "ماستري"],
  PhD: ["phd*", "doctora*", "دكتوراه", "دكتوراة", "دكتورا", "دوكتورا", "دكتوراء", "ډاكټر*", "ډاكتر*"],
};
const FULL = ["fully funded", "full funding", "full scholarship*", "ممول*", "ممولة*", "تمويل كامل", "بالكامل", "بشپړ تمويل*"];
const SOON = ["soon", "closing", "urgent", "deadline*", "ending", "last chance", "this month", "قريب*", "ينتهي", "تنتهي", "اخر موعد", "اخر اجل", "عاجل", "ژر", "نږدي", "وروستي نيټه"];
const ALL = ["all", "everything", "list", "show me", "كل", "جميع", "الكل", "كلها", "ټول", "ټوله"];
const GREET = ["hi", "hello", "hey", "salam", "salaam", "assalam*", "مرحبا", "السلام", "سلام", "اهلا", "هلا"];
const THANKS = ["thanks", "thank you", "thx", "شكرا", "مننه", "مشكور"];
const OPEN_ALL = ["all nationalit*", "any nationalit*", "every nationalit*", "كل الجنسيات", "جميع الجنسيات", "ټولو تابعيتونو"];

const FROM = ["from", "citizen", "من", "له"];

// Questions with a written answer, most specific first.
const FAQ: [string, string[]][] = [
  ["motivation", ["motivation*", "cover letter", "statement of purpose", "personal statement", "sop", "essay", "رساله تحفيز*", "خطاب تحفيز*", "تحفيزي*", "رساله الدافع", "انګيزه", "انګيزې", "انگيزه"]],
  ["recommendation", ["recommendation*", "reference letter*", "referee*", "توصيه", "تزكيه", "سپارښت*"]],
  ["visa", ["visa*", "embassy", "passport", "تاشيره", "فيزا", "سفاره", "جواز", "ويزه", "ويزا"]],
  ["language", ["ielts", "toefl", "duolingo", "english test", "language test", "language", "لغه", "اللغه", "انجليزي*", "ايلتس", "توفل", "ژبه", "ژبې"]],
  ["fees", ["fee", "fees", "pay", "paid", "payment", "cost*", "price", "money", "charge*", "scam*", "free", "رسوم", "مجاني*", "مجانا", "ادفع", "دفع", "فلوس", "سعر", "تكلفه", "احتيال", "نصب", "فيس", "پيسي", "وړيا"]],
  ["eligibility", ["eligib*", "nationalit*", "citizen*", "requirement*", "who can apply", "conditions", "شروط", "جنسيه", "جنسيات", "اهليه", "متطلبات", "شرايط", "وړتيا", "تابعيت*"]],
  ["register", ["register*", "registration", "sign up", "signup", "account", "login", "log in", "sign in", "subscribe*", "newsletter", "تسجيل", "سجل", "حساب", "اشترك", "اشتراك", "نوم ليكنه", "نوم ليکنه"]],
  ["contact", ["contact*", "telegram", "instagram", "whatsapp", "email", "e mail", "support", "تواصل", "اتصال", "تيليجرام", "تلغرام", "تليجرام", "انستغرام", "انستقرام", "واتساب", "ايميل", "اړيكه", "اړيكې", "ټيليګرام"]],
  ["about", ["who are you", "what is scholarhelp", "about you", "about scholarhelp", "من انتم", "من انت", "ما هو", "ته څوك يې", "تاسو څوك ياست"]],
  ["apply", ["apply*", "application*", "how to", "how do i", "steps", "اقدم", "التقديم", "تقديم", "اتقدم", "قدم", "كيف", "غوښتنه", "څنګه", "څنگه"]],
];

// Common words that never narrow a search.
const STOP = new Set(norm(`a an the and or for to in on at of with from by is are am be i me my we you your it this that what which where when how do does can could
  want need looking look find show give get please any some open opportunity opportunities program programs programme study studies student students university
  في من الى على عن او و ما هل كيف اريد ابحث عن لي انا هذه هذا التي الذي فرصه فرص برنامج دراسه للدراسه طالب طلاب جامعه جامعات ممكن يوجد
  زه ته موږ تاسو چې د په له ته کې څه څنګه غواړم لټوم يو دا هغه فرصت فرصتونه زده كړه پوهنتون`).split(" "));

const ALIASES: Record<string, string[]> = {
  GB: ["uk", "britain", "great britain", "england", "united kingdom", "بريطانيا", "انجلترا", "انكلترا", "المملكه المتحده", "انګلستان", "برتانيه"],
  US: ["usa", "america", "united states", "the states", "امريكا", "امريكيا", "الولايات المتحده", "امريكه"],
  AE: ["uae", "emirates", "dubai", "abu dhabi", "الامارات", "امارات", "دبي", "ابوظبي"],
  SA: ["saudi", "ksa", "السعوديه", "سعودي", "سعوديه"],
  DE: ["germany", "deutschland", "المانيا", "جرمني"],
  EU: ["europe", "european", "اوروبا", "اوربا", "اروپا"],
  CH: ["swiss", "سويسرا"],
  KR: ["korea", "كوريا"],
  TR: ["turkey", "turkiye", "تركيا"],
  CN: ["china", "الصين", "چين"],
  NL: ["holland", "netherlands", "هولندا"],
};

export function createBrain(data: ChatData, lang: string, today = new Date()) {
  const day0 = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const daysLeft = (d: string) => (d ? Math.round((Date.parse(d) - day0) / 864e5) : null);
  const isOpen = (o: ChatOpp) => { const n = daysLeft(o.d); return n === null || n >= 0; };
  const open = data.opps.filter(isOpen);
  // Soonest deadline first; "open all year" at the end.
  const byDeadline = (a: ChatOpp, b: ChatOpp) => (a.d || "9999").localeCompare(b.d || "9999");

  // Country names in English, the page language and Pashto/Arabic, for every country (so we can also say "none in Canada").
  let names: Intl.DisplayNames[] = [];
  let pageNames: Intl.DisplayNames | null = null;
  try {
    names = [...new Set(["en", lang, "ar", "ps"])].map((l) => new Intl.DisplayNames([l], { type: "region" }));
    pageNames = new Intl.DisplayNames([lang, "en"], { type: "region" });
  } catch {}
  const codes = new Set<string>(["EU"]);
  for (const o of data.opps) if (o.cc) codes.add(o.cc.toUpperCase());
  for (const c of "AE AR AT AU BD BE BR CA CH CN CZ DE DK DZ EG ES FI FR GB GR HU ID IE IN IQ IR IT JO JP KR KW LB LY MA MY NG NL NO NZ OM PK PL PS PT QA RO RU SA SD SE SG SK SY TN TR TW UA US YE ZA AF".split(" ")) codes.add(c);
  const countryNames: { code: string; phrase: string }[] = [];
  for (const code of codes) {
    const set = new Set<string>(ALIASES[code] || []);
    for (const n of names) { try { const v = n.of(code); if (v && v !== code) set.add(v); } catch {} }
    for (const o of data.opps) if (o.cc.toUpperCase() === code) { set.add(o.k); set.add(o.c); }
    for (const p of set) if (norm(p)) countryNames.push({ code, phrase: p });
  }
  // Longest names first, so "south korea" wins over "korea".
  countryNames.sort((a, b) => b.phrase.length - a.phrase.length);
  const countryLabel = (code: string) => {
    try { const v = pageNames?.of(code); if (v && v !== code) return v; } catch {}
    return data.opps.find((o) => o.cc.toUpperCase() === code)?.c || code;
  };

  function filter(f: Filters) {
    return open
      .filter((o) =>
        (!f.cat || o.cat === f.cat) &&
        (!f.level || !o.lv.length || o.lv.includes(f.level) || o.lv.includes("Any")) &&
        (!f.countryCode || o.cc.toUpperCase() === f.countryCode) &&
        (!f.funding || o.f === f.funding) &&
        (!f.soon || (daysLeft(o.d) ?? 999) <= 90) &&
        (!f.openAll || /\b(all|any|every)\b|worldwide|outside/i.test(o.e)))
      .sort(byDeadline);
  }

  /** Score listings against free words (names, universities, fields). Allows one typo in longer words. */
  function search(words: string[], pool: ChatOpp[]) {
    const scored: [ChatOpp, number][] = [];
    for (const o of pool) {
      const title = norm(`${o.t} ${o.h}`).split(" ");
      const body = norm(`${o.s} ${o.c}`).split(" ");
      let score = 0;
      for (const w of words) {
        const near = (x: string) => x === w || (w.length >= 4 && x.startsWith(w)) || (w.length >= 5 && x.length >= 5 && edit1(x, w));
        if (title.some(near)) score += 3; else if (body.some(near)) score += 1;
      }
      if (score) scored.push([o, score]);
    }
    return scored.sort((a, b) => b[1] - a[1] || byDeadline(a[0], b[0])).map(([o]) => o);
  }

  function answer(text: string): Answer {
    const tokens = norm(text).split(" ").filter(Boolean);
    if (!tokens.length) return { kind: "fallback" };
    const used = new Set<number>();
    const take = (list: string[]) => {
      for (const k of list) {
        const i = hasPhrase(tokens, k);
        if (i >= 0) { const n = norm(k.replace(/\*$/, "")).split(" ").length; for (let j = i; j < i + n; j++) used.add(j); return k; }
      }
      return undefined;
    };

    const f: Filters = {};
    for (const [lv, list] of Object.entries(LEVELS)) if (take(list)) { f.level = lv; break; }
    if (take(OPEN_ALL)) f.openAll = true;
    for (const [cat, list] of Object.entries(CATS)) if (take(list)) { f.cat = cat; break; }
    if (take(FULL)) f.funding = "full";
    if (take(SOON)) f.soon = true;
    let nationality = false;
    for (const { code, phrase } of countryNames) {
      const i = hasPhrase(tokens, phrase);
      if (i < 0) continue;
      take([phrase]);
      // "I'm from Egypt" is about who can apply, not where to study.
      if (i > 0 && FROM.includes(tokens[i - 1])) { nationality = true; break; }
      f.countryCode = code; f.country = open.find((o) => o.cc.toUpperCase() === code)?.k;
      break;
    }
    let faq = FAQ.find(([, list]) => take(list))?.[0];
    if (nationality && (!faq || faq === "apply")) faq = "eligibility";
    const greet = take(GREET);
    const thanks = take(THANKS);
    const all = take(ALL);
    const words = tokens.filter((w, i) => !used.has(i) && !STOP.has(w) && w.length >= 3 && !/^\d+$/.test(w));
    const hasFilter = !!(f.cat || f.level || f.countryCode || f.funding || f.soon || f.openAll);

    // A question we have a written answer for. Names of listings in the same question are shown with it.
    // "Free scholarships" means fully funded ones, not a question about fees.
    if (faq === "fees" && hasFilter) { f.funding = "full"; faq = undefined; }
    if (faq === "apply" && hasFilter) faq = undefined;
    if (faq) {
      const hits = words.length ? search(words, open) : [];
      if (faq === "eligibility") return { kind: "faq", key: faq, opps: filter({ ...f, openAll: true }) };
      return { kind: "faq", key: faq, opps: hits.slice(0, 3) };
    }
    if (hasFilter || all) {
      let list = filter(f);
      if (words.length) {
        const hits = search(words, list);
        if (hits.length) list = hits;
        // "Deadline for Gates?": the name matters more than "closing soon".
        else if (!f.cat && !f.level && !f.countryCode) { const any = search(words, open); if (any.length) return { kind: "results", filters: {}, opps: any, total: any.length }; }
      }
      // Nothing matches every detail: show the closest listings (same country, else same category or level).
      if (!list.length) {
        const tries: Filters[] = f.countryCode ? [{ countryCode: f.countryCode, country: f.country }] : [{ cat: f.cat, level: f.level }, { cat: f.cat }, { level: f.level }];
        for (const g of tries) {
          if (Object.values(g).every((v) => !v) || JSON.stringify(g) === JSON.stringify(f)) continue;
          const near = filter(g);
          if (near.length) return { kind: "results", filters: g, opps: near, total: near.length, closest: true };
        }
      }
      const missingCountry = f.countryCode && !list.length ? countryLabel(f.countryCode) : undefined;
      return { kind: "results", filters: f, opps: list, total: list.length, missingCountry };
    }
    if (words.length) {
      const hits = search(words, open);
      if (hits.length) return { kind: "results", filters: {}, opps: hits, total: hits.length };
    }
    if (thanks) return { kind: "thanks" };
    if (greet) return { kind: "greet" };
    return { kind: "fallback" };
  }

  /** Countries that have open listings, with how many. */
  const countries = () => {
    const m = new Map<string, { key: string; code: string; label: string; n: number }>();
    for (const o of open) {
      const code = o.cc.toUpperCase();
      const cur = m.get(o.k) || { key: o.k, code, label: code ? countryLabel(code) : o.c, n: 0 };
      cur.n++; m.set(o.k, cur);
    }
    return [...m.values()].sort((a, b) => b.n - a.n || a.label.localeCompare(b.label, lang));
  };

  return { answer, filter, countries, daysLeft, guides: data.guides };
}

/** True when a and b differ by one letter (added, removed or changed). */
function edit1(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, diff = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++diff > 1) return false;
    if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
  }
  return diff + (a.length - i) + (b.length - j) <= 1;
}
