# Changelog

Newest first. Every change is also in the GitHub commit history.

## 2026-10-13

- Every opportunity shows its language requirement (tests, scores, exemptions, checked on the official pages) in a yellow box under the summary and in the Quick overview, in English, Arabic and Pashto. New `language` field in the editor; the build warns if it is missing.

## 2026-10-12

- All 15 opportunities now have Arabic and Pashto versions. `npm run build` warns about any listing missing a language, and a daily routine translates new listings automatically.
- **Launched** on <https://www.scholarhelpu.com>: canonicals, sitemap, llms.txt and social previews use the new domain; robots.txt and pages are open to search engines.
- Admin dashboard at `/dashboard/`: registrations and accounts with search, edit, delete, CSV download and WhatsApp links, plus shortcuts to the content editor, Supabase, Vercel and GitHub. Only emails in the `admins` table can see the data.
- Supabase connected: registrations (name, email, phone, language) are saved in the `subscribers` table, and student accounts (sign up, sign in, saved opportunities, alert preferences) work.
- "Already registered?" checks the email against the registration list.
- Creating an account also counts as registering, so the pop-up stops and the apply links open.
- Privacy policy and the pop-up say we store name, email and phone and keep them private.
- Follow us: Instagram set; Linktree tried and removed at Abdou's request.

## 2026-10-12

### Chat assistant
- A "Help" chat bubble in the bottom corner of every page, in English, Arabic and Pashto.
- It finds open opportunities by country, study level, category, funding and deadline, and answers common questions (fees, how to apply, motivation and recommendation letters, visas, language tests, who can apply, registering, contact).
- It runs in the visitor's browser from the site's own listings: no AI service, no API key, no monthly cost. New listings appear in it automatically.
- Opportunity links in the chat still show the registration pop-up; the chat's own buttons don't.

## 2026-10-11

### SEO
- New `/llms.txt`: a plain-text list of every listing and guide for AI assistants (ChatGPT, Perplexity, Claude, Gemini). Rebuilt on every publish.
- After launch, robots.txt names the AI search crawlers and lets them in, with the same rules as Google.
- New `launched` switch in `src/site.config.mjs`. While it is `false`, robots.txt blocks search engines and every page has a noindex tag.
- Arabic and Pashto pages that still show English text now point Google to the English page, and are left out of hreflang tags and the sitemap. Real translations are listed as before.

### Listings
- 15 real, verified listings. Hansen Leadership Institute 2027 (USA) was added.
- Every listing has a full explanation (about 650 to 950 words), checked against the official pages.
- Quick overview: "Offered by" links to the organisation homepage, and "Opportunity" links to the official announcement.
- Corrected or clarified on the official pages:
  - MBZUAI master's funding is not guaranteed.
  - The Gates, Japan Foundation and Eiffel links were fixed.
  - Yenching pays a travel stipend, not a booked flight.
- New listing fields: organisation homepage, official announcement page, card headline, second deadline, location, duration, dates and fee.

### Opportunity pages
- Order: full description, then Quick overview, then the orange **Apply here** button.
- Country flag beside the location.
- Days-left counter removed. A "Deadline is close" badge shows in the last 14 days, and "Closed" after the deadline.

### Cards
- Light line-art landmark of the host country behind every card picture and page banner, for 12 countries and Europe.
- Announcement-style picture: large opportunity name, flag, small logo and "scholarhelp.com".
- Apply Now opens our own page.
- Fully funded tag in red; partially funded tag in amber.

### Home page
- Subtitle: Scholarships, conferences and exchange programs in bold green with a highlight line.
- Compact category tiles. On phones, the categories become a swipeable row and listings appear on the first screen.
- "How it works" step cards with animated arrows.
- Gradient subscribe band, and a "Follow us" row with brand icons (Facebook, Instagram, YouTube, TikTok, Telegram).
- Stats row removed.

### Registration pop-up
- Fields: name, email, and phone with a flag and country-code picker. The United States is the default.
- Opens after 20 seconds, at 40% scroll, and on any link or button click.
- After "Maybe later", it comes back 30 seconds later, with no limit.
- Stops for good after registering or joining the Telegram group.
- Registered visitors are remembered for good (browser storage plus a 5-year cookie), so Apply opens straight away on any later visit.
- "Already registered? Continue with your email" on a new phone or browser: email only, checked against the registration list once Supabase is connected.
- Saves to Supabase once the anon key is added.

### Search
- Typo-tolerant: "hensen" finds Hansen.
- Shows "Did you mean" and live suggestions with flags.
- Arabic and Pashto country names work.

### Look and feel
- Sharp vector logo with typing dots and a swinging tassel, with the seam in the cap fixed.
- Bigger, darker text and bold navy menu links.
- Red Register button that pops to catch the eye. Animated language switcher.

### Setup
- GitHub repository linked to Vercel, so every push publishes the site.
- Admin panel pointed at the repository.
- Supabase project URL set.
