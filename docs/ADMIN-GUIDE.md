# Admin guide

There are two admin areas:

| Address | For | Sign in with |
| --- | --- | --- |
| `/dashboard/` | Registrations and student accounts: see, search, edit, delete, download as CSV, WhatsApp links | Your ScholarHelp account (email and password). The email must be in the Supabase `admins` table |
| `/admin/` | Opportunities and guides: add, edit, translate, remove | Your GitHub key (below) |

To add another admin to the dashboard, the person creates an account on `/account/`, then in Supabase → **SQL Editor** run: `insert into public.admins (email) values ('their@email.com');`

The admin panel lets you add and edit opportunities and guides from the browser, without touching code.
Every time you press **Save**, the change is saved to GitHub and the site rebuilds itself. It is live about a minute later.

Admin addresses: <https://www.scholarhelpu.com/admin/> (opportunities and guides) and <https://www.scholarhelpu.com/dashboard/> (registrations and accounts).

## 1. Create your admin key (one time)

The panel signs in with a GitHub "token". It works like a password that only opens the ScholarHelp repository.

1. Sign in to GitHub as **abderrahmanelr213-arch**.
2. Open <https://github.com/settings/personal-access-tokens/new>.
3. Fill in:
   - **Token name:** `ScholarHelp admin`
   - **Expiration:** 1 year (or the longest you are comfortable with)
   - **Repository access:** *Only select repositories* → `scholarhelp`
   - **Permissions → Repository permissions → Contents:** *Read and write*. Leave everything else as it is.
4. Click **Generate token** and copy it (it starts with `github_pat_`). GitHub shows it only once. Keep it somewhere private, such as your password manager.

Never post the token in a chat, a screenshot or Telegram. If it leaks, delete it on the same GitHub page and create a new one.

## 2. Sign in

1. Open the admin address above.
2. Click **Sign In with Token**, paste the token and confirm.
3. You now see **Opportunities** and **Guides** on the left.

While the site is still private (Vercel Deployment Protection is on), you also need to be signed in to Vercel in the same browser.

## 3. Add a new opportunity

Click **Opportunities → New Opportunity** and fill in the form. Fields marked *always* are required by our rules.

| Field | What to write |
| --- | --- |
| Title (*always*) | Official name, year, place, and the funding in brackets. Example: `Gates Cambridge Scholarship 2027 in the UK (Fully Funded)` |
| Category (*always*) | University scholarship, Fully funded conference, or Cultural exchange program |
| Short summary (*always*) | One or two sentences in your own words (about 150 characters). Shown on cards and on Google |
| Picture | Optional. Leave empty: the card then shows the country flag, which is our standard style |
| Short headline for the card picture | Optional short name for the card picture, e.g. `Hansen Leadership Institute 2027` |
| Offered by (*always*) | The organisation, e.g. `Gates Cambridge Trust, University of Cambridge` |
| Organisation official website (*always*) | The organisation's homepage, e.g. `https://www.gatescambridge.org/`. The "Offered by" name links here |
| Official announcement page (*always*) | The official page that announces this year's call. The opportunity name links here |
| Host country (*always*) and Country flag code (*always*) | e.g. `United Kingdom` and `gb`. Use `eu` for Europe |
| Location, Duration, Event or program dates | Fill in when the official site gives them |
| Application fee | Only what the official site says (`None`, `USD 50`...). Leave empty if unknown |
| Who can apply (*always*) | Short line, e.g. `Graduates of any nationality, 29 or younger` |
| Study level (*always*) | Bachelor, Master, PhD, Postdoc or Any |
| Funding (*always*) | Fully funded, Partially funded or Travel grant. Only choose Fully funded when the official site confirms tuition and living costs |
| Deadline (*always* if there is one) | The main deadline. Leave empty only for rolling applications |
| Second deadline / deadline note | Optional, e.g. `U.S. applicants: 15 March 2027, 11:55 PM Pacific Time` |
| Official link (*always*) | Where students apply. The orange **Apply here** button goes here |
| Date posted | Today (filled in for you) |
| Draft | Tick it to save without publishing |
| Full description (*always*) | See below |

### The full description

Use these `##` headings in this order. Skip a heading only if the official site gives no information for it.

1. About
2. Host institution / country
3. Financial benefits
4. Eligibility criteria
5. Required documents
6. How to apply
7. Selection process and timeline
8. Tips for a strong application

Only write facts you found on the official site, in your own words. Never guess amounts, dates, GPA, fees or test scores.

Then click **Save**. The listing is live about a minute later.

## 4. Edit or remove an opportunity

- **Edit:** open it from the list, change the fields, **Save**.
- **Hide it without deleting:** tick **Draft** and save.
- **Delete:** open it, then use the menu at the top right → **Delete**.

Closed opportunities do not need to be deleted. After the deadline the site shows "Closed" and moves them to the end automatically.

## 5. Translations

You only need to write the English version. Claude adds the Arabic and Pashto versions of every new opportunity automatically, usually within a day, without asking you.
Until that happens, the Arabic and Pashto pages show the English text with a note.
If you want to write or fix a translation yourself, open the listing and switch on **Arabic** or **Pashto** at the top of the editor, then edit the text fields. Links, dates and the flag code are copied from English automatically.

## Chat assistant answers

The chat bubble finds new listings by itself, so there is nothing to do when you add one. Its written answers (fees, how to apply, contact and so on) are in `src/i18n/chat.ts`, in English, Arabic and Pashto. Edit the sentence in all three languages, commit, and the site rebuilds.

## 6. Give a helper access later

1. On GitHub open the repository → **Settings → Collaborators → Add people** and invite the helper's GitHub account.
2. The helper creates their own token (step 1 above, choosing `abderrahmanelr213-arch/scholarhelp` as the repository) and signs in the same way.
3. To remove access later, remove them from **Collaborators**.

## 7. If something goes wrong

- **"Not found" or "Bad credentials" when signing in:** the token expired or does not have *Contents: Read and write* on `scholarhelp`. Create a new one.
- **The site did not change after saving:** wait two minutes and refresh with Ctrl+F5. Vercel shows each build under the project's **Deployments** tab.
- **A build failed:** usually a wrong date or a link without `https://`. Open the listing, fix the field, save again.
