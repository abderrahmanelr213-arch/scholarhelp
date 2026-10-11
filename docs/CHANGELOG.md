# Changelog

Newest first. Every change is also in the GitHub commit history.

## 2026-10-11

### SEO
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
