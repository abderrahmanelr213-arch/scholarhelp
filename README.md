# ScholarHelp

Fully funded scholarships, conferences and cultural exchange programs for students worldwide, in English, Arabic and Pashto.

Live: <https://www.scholarhelpu.com> · Admin: `/admin/` and `/dashboard/`

## Documentation

| File | For |
| --- | --- |
| [docs/ADMIN-GUIDE.md](docs/ADMIN-GUIDE.md) | Signing in to the admin panel, and adding, editing and translating opportunities |
| [docs/CONTENT-RULES.md](docs/CONTENT-RULES.md) | The rules every listing and design change follows |
| [docs/SETUP.md](docs/SETUP.md) | Hosting, Supabase, social links, domain and launch checklist |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | What changed and when |

## How the project is organised

| Path | What it is |
| --- | --- |
| `src/content/opportunities/en/*.md` | One file per opportunity (English). The admin panel edits these |
| `src/content/opportunities/ar/`, `ps/` | Optional translations with the same file name. Without one, the English text is shown |
| `src/content/guides/en/*.md` | Guides: how to apply, documents, visas, tips |
| `src/content.config.ts` | The list of fields every opportunity can have |
| `src/site.config.mjs` | Site name, domain, social links, Supabase, AdSense |
| `src/i18n/ui.ts` | All interface text in the three languages |
| `src/views/`, `src/components/`, `src/layouts/` | Page layouts and building blocks |
| `src/styles/global.css` | Shared styles and brand colours |
| `public/admin/` | The admin panel (Sveltia CMS) |
| `public/flags/` | Country flags ([flag-icons](https://github.com/lipis/flag-icons), MIT) |
| `supabase/schema.sql` | Database for registrations, accounts and saved opportunities |

Built with [Astro](https://astro.build). Every push to `main`, including saves from the admin panel, publishes the site on Vercel about a minute later.

## Run on a computer

```
npm install
npm run dev
```

Then open <http://localhost:4321>. On Windows PowerShell use `npm.cmd`.
