import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const opportunities = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/opportunities" }),
  schema: z.object({
    title: z.string(),
    category: z.enum(["scholarships", "conferences", "exchange"]),
    summary: z.string(),
    /** Optional picture for the card: the university or organization logo. Without it the card shows the country flag. */
    image: z.string().optional().nullable(),
    host: z.string().optional(),
    // Official homepage of the organisation offering it (the "Offered by" name links here).
    hostUrl: z.string().url().optional(),
    /** Official announcement page (the "Opportunity" name links here). Defaults to `link`. */
    officialUrl: z.string().url().optional(),
    /** Short headline for the card picture, e.g. "Hansen Leadership Institute 2027". Defaults to the title. */
    cardTitle: z.string().optional(),
    /** Extra deadline line shown under the main deadline, e.g. a second deadline for another group. */
    deadlineNote: z.string().optional(),
    country: z.string(),
    /** Two-letter country code for the flag (gb, de, tr...). "eu" for Europe, empty for worldwide. */
    countryCode: z.string().optional().nullable(),
    /** City or venue, e.g. "Brussels, Belgium". Optional. */
    location: z.string().optional().nullable(),
    /** e.g. "4 days", "2 years". Optional. */
    duration: z.string().optional().nullable(),
    /** Event or program dates as text, e.g. "22 to 25 March 2027". Optional. */
    dates: z.string().optional().nullable(),
    /** Application fee as stated officially, e.g. "None" or "USD 50". Optional. */
    fee: z.string().optional().nullable(),
    eligible: z.string().default("All nationalities"),
    /** Language requirement as stated officially, e.g. "IELTS Academic 6.5 or TOEFL iBT 90" or "No test needed". Shown on every page. */
    language: z.string().optional().nullable(),
    levels: z.array(z.string()).default([]),
    funding: z.enum(["full", "partial", "travel"]).default("full"),
    deadline: z.coerce.date().optional().nullable(),
    link: z.string().url(),
    published: z.coerce.date(),
    featured: z.boolean().default(false),
    sample: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/guides" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    topic: z.enum(["apply", "documents", "visa", "tips"]).default("tips"),
    published: z.coerce.date(),
    readingMinutes: z.number().default(5),
    /** Short questions and answers shown at the end of the guide and sent to Google as FAQPage data. */
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { opportunities, guides };
