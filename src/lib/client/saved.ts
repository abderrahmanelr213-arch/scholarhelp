// Saved opportunities: kept in this browser, and synced to the student's account when signed in.
import { getSupabase, currentUser } from "./supabase";

export type SavedItem = { slug: string; title: string; href: string };
const KEY = "sh-saved";

function readLocal(): SavedItem[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function writeLocal(items: SavedItem[]) {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
}

export async function listSaved(): Promise<SavedItem[]> {
  const user = await currentUser();
  const local = readLocal();
  if (!user) return local;
  const sb = (await getSupabase())!;
  const { data, error } = await sb.from("saved").select("slug,title,href").order("created_at", { ascending: false });
  if (error) return local;
  // First sign-in on this browser: push anything saved before signing in.
  const remote = data as SavedItem[];
  const missing = local.filter((l) => !remote.some((r) => r.slug === l.slug));
  if (missing.length) {
    await sb.from("saved").upsert(missing.map((m) => ({ ...m, user_id: user.id })), { onConflict: "user_id,slug" });
  }
  const merged = [...remote, ...missing];
  writeLocal(merged);
  return merged;
}

export async function toggleSaved(item: SavedItem): Promise<boolean> {
  const local = readLocal();
  const exists = local.some((s) => s.slug === item.slug);
  const next = exists ? local.filter((s) => s.slug !== item.slug) : [item, ...local];
  writeLocal(next);
  const user = await currentUser();
  if (user) {
    const sb = (await getSupabase())!;
    if (exists) await sb.from("saved").delete().eq("user_id", user.id).eq("slug", item.slug);
    else await sb.from("saved").upsert({ ...item, user_id: user.id }, { onConflict: "user_id,slug" });
  }
  return !exists;
}

/** Wire every heart button on the page. */
export async function initSaveButtons() {
  const buttons = [...document.querySelectorAll<HTMLButtonElement>("[data-save]")];
  if (!buttons.length) return;
  const paint = (slugs: Set<string>) => buttons.forEach((b) => b.setAttribute("aria-pressed", String(slugs.has(b.dataset.save!))));
  paint(new Set(readLocal().map((s) => s.slug)));
  buttons.forEach((b) => b.addEventListener("click", async (e) => {
    e.preventDefault();
    const on = await toggleSaved({ slug: b.dataset.save!, title: b.dataset.title || "", href: b.dataset.href || "" });
    document.querySelectorAll<HTMLButtonElement>(`[data-save="${CSS.escape(b.dataset.save!)}"]`).forEach((x) => x.setAttribute("aria-pressed", String(on)));
  }));
  const all = await listSaved();
  paint(new Set(all.map((s) => s.slug)));
}
