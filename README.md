# ScholarHelp

Fully funded scholarships, conferences and cultural exchange programs for students worldwide, in English, Arabic and Pashto.

Built with [Astro](https://astro.build) as a fast static site: every opportunity gets its own page in each language, which is what Google indexes.

## What's inside

| Path | What it is |
| --- | --- |
| `src/site.config.mjs` | Site name, domain, Telegram link, social links, AdSense id, newsletter form, Google verification |
| `src/content/opportunities/en/*.md` | One file per opportunity (English, required) |
| `src/content/opportunities/ar/`, `ps/` | Optional translations with the same file name. Missing translations fall back to English. |
| `src/content/guides/en/*.md` | Guides (the info base): how to apply, documents, visas, tips |
| `supabase/schema.sql` | Database for student accounts, saved opportunities and email subscribers |
| `src/i18n/ui.ts` | All interface text in the three languages |
| `public/admin/` | The admin panel (`/admin/`) for you and your team |
| `public/og-image.png` | Preview image shown when a link is shared on Telegram, WhatsApp, Facebook |

Pages: home, an opportunity browser with filters (country, level, category, funding, deadline, kept in the link), a guides section, a student account page, one page per category, one page per opportunity, About, Contact, Privacy, Terms, plus `sitemap.xml` (with hreflang for all languages) and `robots.txt`.

## Going live (free hosting on Vercel)

The site is hosted on Vercel (project `website`) and linked to this GitHub repository.
Every push to the `main` branch, including posts saved from the admin panel, builds and publishes the site automatically in a minute or two.

1. **Domain**: buy `scholarhelp.com` (about $10/year), then in Vercel → project → Settings → Domains add it and follow the DNS steps.
2. Update `url` in `src/site.config.mjs` and `site_url` in `public/admin/config.yml` to the new domain.

## Posting opportunities (admin panel)

1. Add your helper as a collaborator on the GitHub repository.
2. Each of you creates a GitHub fine-grained personal access token with **Contents: Read and write** on this repository.
3. Open `https://scholarhelp.com/admin/`, choose **Sign in with token**, paste it.
4. Click **New Opportunity**, fill the form, **Save**. The site updates about a minute later.

To translate a listing, open it and switch on Arabic or Pashto at the top of the editor.

Optional: for a "Sign in with GitHub" button instead of tokens, deploy [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) to Cloudflare Workers (free) and set `base_url` in `public/admin/config.yml`.

## SEO checklist after launch

- Add the site to [Google Search Console](https://search.google.com/search-console), paste the verification code into `googleVerification`, and submit `https://scholarhelp.com/sitemap.xml`.
- Do the same in Bing Webmaster Tools.
- Write every summary and description in your own words. Copied text ranks badly and is refused by AdSense.
- Post each new listing on Telegram and social media with its page link.

## Student accounts and email news (Supabase, free)

1. Create a free project at [supabase.com](https://supabase.com) (the free plan covers 50,000 monthly users; a free project pauses after a week with no visits and wakes up when you open it in the dashboard).
2. In **SQL Editor**, paste the contents of `supabase/schema.sql` and click **Run**.
3. In **Authentication → URL Configuration**, set the Site URL to `https://scholarhelp.com` and add `https://scholarhelp.com/**` to the redirect URLs.
4. In **Project Settings → API**, copy the Project URL and the `anon` public key into `supabaseUrl` and `supabaseAnonKey` in `src/site.config.mjs`.
5. Optional: enable Google in **Authentication → Providers**, then set `googleSignIn: true`.

Until this is set up, the site still works: the hearts save opportunities in the visitor's browser and the subscribe box points to Telegram and Instagram.
Subscribers and student preferences are in the `subscribers` and `profiles` tables; export them as CSV from **Table Editor** for your email tool.

## Pictures on cards

Each opportunity can have a picture (the university or organization logo) uploaded in the admin form. Without a picture, the card shows the country flag from `countryCode` (two letters, `eu` for Europe, empty for worldwide). Flags come from [flag-icons](https://github.com/lipis/flag-icons) (MIT).

## Ads, later

When AdSense approves the site, put your `ca-pub-...` id in `adsenseClient` and an ad unit id in the `<AdSlot slot="...">` tags (home, category and opportunity pages). With no id, no ad code loads.

## Before launch

All current listings are marked `sample: true` (they show a warning). Check each date on the official site, then set `sample: false` or delete them.

## Run on your computer

```
npm install
npm run dev
```
Then open http://localhost:4321
