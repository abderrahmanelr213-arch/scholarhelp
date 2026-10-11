import { SITE } from "../../site.config.mjs";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: Promise<SupabaseClient | null> | null = null;

export const accountsEnabled = Boolean(SITE.supabaseUrl && SITE.supabaseAnonKey);

/** The Supabase client, loaded only on demand so pages stay light. Null when accounts are not configured. */
export function getSupabase(): Promise<SupabaseClient | null> {
  if (!accountsEnabled) return Promise.resolve(null);
  client ??= import("@supabase/supabase-js").then(({ createClient }) =>
    createClient(SITE.supabaseUrl, SITE.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true } })
  );
  return client;
}

export async function currentUser() {
  const sb = await getSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session?.user ?? null;
}
