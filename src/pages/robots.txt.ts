import type { APIRoute } from "astro";
import { SITE } from "../site.config.mjs";

const RULES = "Allow: /\nDisallow: /admin/\nDisallow: /account/\nDisallow: /ar/account/\nDisallow: /ps/account/\n";
// AI search and assistant crawlers, named so it is clear they are welcome (they follow the same rules).
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Claude-SearchBot", "Google-Extended", "Applebot-Extended", "Bingbot"];

export const GET: APIRoute = () =>
  new Response(
    !SITE.launched
      ? "User-agent: *\nDisallow: /\n"
      : `User-agent: *\n${RULES}\n${AI_BOTS.map((b) => `User-agent: ${b}`).join("\n")}\n${RULES}\nSitemap: ${new URL("/sitemap.xml", SITE.url).href}\n`,
    { headers: { "Content-Type": "text/plain" } },
  );
