import type { APIRoute } from "astro";
import { SITE } from "../site.config.mjs";
export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /account/\nDisallow: /ar/account/\nDisallow: /ps/account/\n\nSitemap: ${new URL("/sitemap.xml", SITE.url).href}\n`, { headers: { "Content-Type": "text/plain" } });
