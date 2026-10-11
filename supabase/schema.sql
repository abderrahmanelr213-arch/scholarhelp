-- ScholarHelp database. Run in Supabase → SQL Editor → New query → Run. Safe to run again after updates.

-- Student profiles and email alert preferences.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  lang text default 'en',
  categories text[] default '{}',
  levels text[] default '{}',
  newsletter boolean default true,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
drop policy if exists "Students read their profile" on public.profiles;
create policy "Students read their profile" on public.profiles for select using (auth.uid() = id);
drop policy if exists "Students create their profile" on public.profiles;
create policy "Students create their profile" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "Students update their profile" on public.profiles;
create policy "Students update their profile" on public.profiles for update using (auth.uid() = id);

-- Create a profile automatically when someone signs up.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, lang, newsletter)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', coalesce(new.raw_user_meta_data->>'lang', 'en'),
          coalesce((new.raw_user_meta_data->>'newsletter')::boolean, true))
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Saved opportunities.
create table if not exists public.saved (
  user_id uuid not null references auth.users (id) on delete cascade,
  slug text not null,
  title text,
  href text,
  created_at timestamptz default now(),
  primary key (user_id, slug)
);
alter table public.saved enable row level security;
drop policy if exists "Students read their saved" on public.saved;
create policy "Students read their saved" on public.saved for select using (auth.uid() = user_id);
drop policy if exists "Students add saved" on public.saved;
create policy "Students add saved" on public.saved for insert with check (auth.uid() = user_id);
drop policy if exists "Students update saved" on public.saved;
create policy "Students update saved" on public.saved for update using (auth.uid() = user_id);
drop policy if exists "Students remove saved" on public.saved;
create policy "Students remove saved" on public.saved for delete using (auth.uid() = user_id);

-- Email news subscribers (from the subscribe box; no account needed).
create table if not exists public.subscribers (
  email text primary key check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  lang text default 'en',
  created_at timestamptz default now()
);
-- Name from the simple registration box.
alter table public.subscribers add column if not exists name text;
alter table public.subscribers enable row level security;
-- Visitors can add their email but can never read the list.
drop policy if exists "Anyone can subscribe" on public.subscribers;
create policy "Anyone can subscribe" on public.subscribers for insert to anon, authenticated with check (true);
