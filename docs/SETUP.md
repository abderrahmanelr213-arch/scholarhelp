# Setup and launch checklist

## Where things live

| Thing | Where |
| --- | --- |
| Code | GitHub: <https://github.com/abderrahmanelr213-arch/scholarhelp> (branch `main`) |
| Hosting | Vercel project `website` (team abdou-6f62): <https://www.scholarhelpu.com> (also <https://website-rho-ten-93.vercel.app>) |
| Admin panel | `/admin/` on the site (see [ADMIN-GUIDE.md](ADMIN-GUIDE.md)) |
| Database | Supabase project `akowmqhgwtswhytrmbek` (student accounts and registrations) |

Every push to `main`, including saves from the admin panel, builds and publishes the site automatically.

## Status

| Step | Status |
| --- | --- |
| Vercel hosting linked to GitHub | Done |
| Vercel Deployment Protection | **Abdou to turn off** (launch, 2026-10-12) |
| Supabase project URL in `src/site.config.mjs` | Done |
| Supabase public key in `src/site.config.mjs` | Done (2026-10-12) |
| Database tables from `supabase/schema.sql` | Done (2026-10-12). Run it again after each update; it is safe to re-run |
| Supabase Site URL and redirect URLs for the new domain | **Waiting for Abdou** |
| Facebook, YouTube, TikTok links | **Waiting for Abdou** |
| Domain `scholarhelpu.com` (www is the main address) | Done (2026-10-12) |
| `launched: true` in `src/site.config.mjs` | Done (2026-10-12) |

## Supabase (registrations and accounts)

1. Supabase → **SQL Editor** → paste all of `supabase/schema.sql` → **Run**.
2. **Authentication → URL Configuration:** Site URL `https://www.scholarhelpu.com`, and add `https://www.scholarhelpu.com/**` and `https://scholarhelpu.com/**` to the redirect URLs.
3. **Project Settings → API:** copy the **anon public** key and send it (only that one; never the service_role or secret key). It goes in `supabaseAnonKey` in `src/site.config.mjs`.

**See the sign-ups:** Supabase → **Table Editor** → `subscribers` (pop-up registrations and newsletter) and **Authentication → Users** (student accounts).

Registrations are saved in the `subscribers` table (name, email, phone with country code, language). Export them as CSV from **Table Editor**.

## Social links

Instagram (`scholarhelpu`) is set. Paste the Facebook, YouTube and TikTok links into `social` in `src/site.config.mjs`. Empty links show as greyed-out icons.

## Going public (done 2026-10-12)

1. Domain `scholarhelpu.com` bought and added in Vercel (`scholarhelpu.com` redirects to `www.scholarhelpu.com`).
2. `url` in `src/site.config.mjs` and `site_url`/`display_url` in `public/admin/config.yml` set to `https://www.scholarhelpu.com`, and `launched: true`.
3. Abdou: turn off Vercel Deployment Protection.
4. Abdou: Supabase Site URL `https://www.scholarhelpu.com`, redirect URLs `https://www.scholarhelpu.com/**` and `https://scholarhelpu.com/**`.
5. Abdou: add the site to Google Search Console and Bing Webmaster Tools and submit `https://www.scholarhelpu.com/sitemap.xml`.

## Ads, later

When AdSense approves the site, put the `ca-pub-...` id in `adsenseClient` in `src/site.config.mjs` and ad unit ids in the `<AdSlot slot="...">` tags. With no id, no ad code loads.

## Run on a computer

```
npm install
npm run dev
```

Then open <http://localhost:4321>. On Windows PowerShell use `npm.cmd` instead of `npm`.
