# Setup and launch checklist

## Where things live

| Thing | Where |
| --- | --- |
| Code | GitHub: <https://github.com/abderrahmanelr213-arch/scholarhelp> (branch `main`) |
| Hosting | Vercel project `website` (team abdou-6f62): <https://website-rho-ten-93.vercel.app> |
| Admin panel | `/admin/` on the site (see [ADMIN-GUIDE.md](ADMIN-GUIDE.md)) |
| Database | Supabase project `akowmqhgwtswhytrmbek` (student accounts and registrations) |

Every push to `main`, including saves from the admin panel, builds and publishes the site automatically.

## Status

| Step | Status |
| --- | --- |
| Vercel hosting linked to GitHub | Done |
| Vercel Deployment Protection | **On on purpose** (site not public yet) |
| Supabase project URL in `src/site.config.mjs` | Done |
| Supabase anon public key | **Waiting for Abdou** |
| Run `supabase/schema.sql` in Supabase SQL Editor | **Waiting for Abdou** (run it again after each update; it is safe to re-run) |
| Supabase Site URL | **Waiting for Abdou** |
| Facebook, YouTube, TikTok links | **Waiting for Abdou** |
| Domain `scholarhelp.com` | Not bought yet |

## Supabase (registrations and accounts)

1. Supabase → **SQL Editor** → paste all of `supabase/schema.sql` → **Run**.
2. **Authentication → URL Configuration:** Site URL `https://website-rho-ten-93.vercel.app` (later `https://scholarhelp.com`), and add `https://website-rho-ten-93.vercel.app/**` to the redirect URLs.
3. **Project Settings → API:** copy the **anon public** key and send it (only that one; never the service_role or secret key). It goes in `supabaseAnonKey` in `src/site.config.mjs`.

Registrations are saved in the `subscribers` table (name, email, phone with country code, language). Export them as CSV from **Table Editor**.

## Social links

Paste the Facebook, YouTube and TikTok links into `social` in `src/site.config.mjs`. Empty links show as greyed-out icons.

## Going public

1. Buy `scholarhelp.com` (about $10 a year).
2. Vercel → project → **Settings → Domains** → add it and follow the DNS steps.
3. Change `url` in `src/site.config.mjs`, and `site_url` and `display_url` in `public/admin/config.yml`, to `https://scholarhelp.com`.
4. Update the Supabase Site URL to the new domain.
5. Turn off Vercel Deployment Protection.
6. Add the site to Google Search Console and Bing Webmaster Tools and submit `https://scholarhelp.com/sitemap.xml`.

## Ads, later

When AdSense approves the site, put the `ca-pub-...` id in `adsenseClient` in `src/site.config.mjs` and ad unit ids in the `<AdSlot slot="...">` tags. With no id, no ad code loads.

## Run on a computer

```
npm install
npm run dev
```

Then open <http://localhost:4321>. On Windows PowerShell use `npm.cmd` instead of `npm`.
