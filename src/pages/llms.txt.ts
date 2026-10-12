import type { APIRoute } from "astro";
import { SITE } from "../site.config.mjs";
import { getOpps, getGuides, isoDate } from "../lib/opps";

// A plain-text map of the site for AI assistants (https://llmstxt.org). Rebuilt on every publish.
export const GET: APIRoute = async () => {
  const abs = (p: string) => new URL(p, SITE.url).href;
  const opps = await getOpps("en");
  const guides = await getGuides("en");
  const line = (title: string, path: string, note: string) => `- [${title}](${abs(path)}): ${note}`;
  const text = `# ${SITE.name}

> ${SITE.name} lists fully and partially funded scholarships, conferences and exchange programs for students worldwide, in English, Arabic and Pashto. Every listing links to the official announcement and states the deadline, who can apply and what is paid.

## Opportunities

${opps.map((o) => {
  const d = o.entry.data;
  return line(d.title, `/opportunities/${o.slug}/`, `${d.summary} Deadline: ${isoDate(d.deadline) || "rolling"}.`);
}).join("\n")}

## Guides

${guides.map((g) => line(g.entry.data.title, `/guides/${g.slug}/`, g.entry.data.summary)).join("\n")}

## Browse

- [All opportunities](${abs("/opportunities/")})
- [Scholarships](${abs("/scholarships/")})
- [Conferences](${abs("/conferences/")})
- [Exchange programs](${abs("/exchange/")})
- [Arabic version](${abs("/ar/")})
- [Pashto version](${abs("/ps/")})
`;
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
