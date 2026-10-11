// Main settings for ScholarHelp. Change these, commit, and the site rebuilds.
export const SITE = {
  name: "ScholarHelp",
  // Your real domain once you buy it, with https:// and no trailing slash.
  url: "https://scholarhelp.com",
  // false = Google and Bing are told not to index the site (robots.txt blocks everything and every page
  // gets a noindex tag). Switch to true on launch day, after the real domain works.
  launched: false,
  email: "contact@scholarhelp.com",
  telegram: "https://t.me/Scholarhelp213",
  social: {
    instagram: "https://www.instagram.com/scholarhelpu",
    // Paste your links here when the accounts are ready. Empty = the icon shows but goes nowhere yet.
    facebook: "",
    youtube: "",
    tiktok: "",
    x: "",
    linkedin: "",
  },
  // Student accounts and email subscriptions (Supabase, free plan). Paste the Project URL and the
  // "anon public" key from Supabase → Project Settings → API. Empty = sign in shows "coming soon"
  // and saved opportunities stay in the visitor's browser only.
  supabaseUrl: "https://akowmqhgwtswhytrmbek.supabase.co",
  supabaseAnonKey: "",
  // Turn on after enabling the Google provider in Supabase → Authentication → Providers.
  googleSignIn: false,
  // Paste your Google AdSense publisher id (ca-pub-...) when you are approved. Empty = no ads anywhere.
  adsenseClient: "",
  // Google Search Console verification code (content of the meta tag).
  googleVerification: "",
};

export const LOCALES = ["en", "ar", "ps"];
export const DEFAULT_LOCALE = "en";

export const CATEGORIES = ["scholarships", "conferences", "exchange"];
