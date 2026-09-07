begin;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated, service_role;

alter table public.profiles
  add column if not exists role text not null default 'member';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_role_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_role_check
      check (role in ('member', 'admin'));
  end if;
end
$$;

create index if not exists profiles_role_idx
  on public.profiles (role)
  where role = 'admin';

comment on column public.profiles.role is
  'Server-provisioned authorization role. Never include this column in user-editable grants.';

-- Supabase projects can have broad default privileges. Reset this table so the
-- new authorization column can never be written through an end-user token.
revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;
grant insert (id, email, full_name, avatar_url, company, website, onboarding_completed)
  on table public.profiles to authenticated;
grant update (full_name, avatar_url, company, website, onboarding_completed, updated_at)
  on table public.profiles to authenticated;

-- Backfill identities created before the profile trigger was installed. Existing
-- profile choices win, and every backfilled account remains a non-admin member.
insert into public.profiles as existing (id, email, full_name, avatar_url, company)
select
  users.id,
  users.email,
  coalesce(
    users.raw_user_meta_data ->> 'full_name',
    users.raw_user_meta_data ->> 'name'
  ),
  users.raw_user_meta_data ->> 'avatar_url',
  users.raw_user_meta_data ->> 'company'
from auth.users as users
on conflict (id) do update
set
  email = coalesce(existing.email, excluded.email),
  full_name = coalesce(existing.full_name, excluded.full_name),
  avatar_url = coalesce(existing.avatar_url, excluded.avatar_url),
  company = coalesce(existing.company, excluded.company);

create or replace function public.handle_ennearock_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    company
  )
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'company'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_ennearock_new_user() from public;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated, service_role;

create table if not exists public.site_content (
  key text primary key
    check (key in (
      'general',
      'announcement',
      'hero',
      'metrics',
      'templates',
      'services',
      'portfolio',
      'process',
      'testimonial',
      'pricing',
      'cta'
    )),
  content jsonb not null default '{}'::jsonb
    check (jsonb_typeof(content) = 'object'),
  published boolean not null default true,
  sort_order integer not null default 0
    check (sort_order >= 0),
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_content_published_order_idx
  on public.site_content (published, sort_order, key);

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
before update on public.site_content
for each row execute function public.set_updated_at();

alter table public.site_content enable row level security;

revoke all on table public.site_content from anon, authenticated;
grant select (key, content, published, sort_order, created_at, updated_at)
  on table public.site_content to anon, authenticated;
grant insert, update, delete on table public.site_content to authenticated;

drop policy if exists "Published site content is publicly readable"
  on public.site_content;
create policy "Published site content is publicly readable"
on public.site_content
for select
to anon, authenticated
using (published = true);

drop policy if exists "Admins can read all site content"
  on public.site_content;
create policy "Admins can read all site content"
on public.site_content
for select
to authenticated
using ((select private.is_admin()));

drop policy if exists "Admins can insert site content"
  on public.site_content;
create policy "Admins can insert site content"
on public.site_content
for insert
to authenticated
with check ((select private.is_admin()));

drop policy if exists "Admins can update site content"
  on public.site_content;
create policy "Admins can update site content"
on public.site_content
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "Admins can delete site content"
  on public.site_content;
create policy "Admins can delete site content"
on public.site_content
for delete
to authenticated
using ((select private.is_admin()));

insert into public.site_content (key, content, published, sort_order)
values
  ('general', '{}'::jsonb, true, 10),
  ('announcement', '{}'::jsonb, true, 20),
  ('hero', '{}'::jsonb, true, 30),
  ('metrics', '{}'::jsonb, true, 40),
  ('templates', '{}'::jsonb, true, 50),
  ('services', '{}'::jsonb, true, 60),
  ('portfolio', '{}'::jsonb, true, 70),
  ('process', '{}'::jsonb, true, 80),
  ('testimonial', '{}'::jsonb, true, 90),
  ('pricing', '{}'::jsonb, true, 100),
  ('cta', '{}'::jsonb, true, 110)
on conflict (key) do nothing;

alter table public.products
  add column if not exists sort_order integer not null default 0,
  add column if not exists cover_image_url text,
  add column if not exists client text,
  add column if not exists duration text,
  add column if not exists engagement text,
  add column if not exists story jsonb not null default '{}'::jsonb,
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists updated_by uuid references public.profiles (id) on delete set null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_sort_order_check'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products
      add constraint products_sort_order_check check (sort_order >= 0);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_story_object_check'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products
      add constraint products_story_object_check
      check (jsonb_typeof(story) = 'object');
  end if;
end
$$;

update public.products
set
  sort_order = case when sort_order = 0 then 60 else sort_order end,
  client = coalesce(nullif(client, ''), 'Distributed consultancy'),
  duration = coalesce(nullif(duration, ''), '14 weeks'),
  engagement = coalesce(
    nullif(engagement, ''),
    'Product strategy, UX & engineering'
  ),
  story = case
    when story = '{}'::jsonb then $story$
      {
        "intro": "Northstar had outgrown the patchwork of tools behind its client work. Together, we shaped one focused product around the way the team actually plans, delivers, and reports.",
        "challenge": {
          "title": "The work moved quickly. The system around it did not.",
          "body": [
            "Project context was split between documents, chat threads, and disconnected trackers. Every weekly update started with someone rebuilding the story of what had happened.",
            "The new platform needed to bring order without slowing a senior team down. It also had to give clients a useful view of progress without exposing the operational noise behind it."
          ]
        },
        "solution": {
          "title": "One shared rhythm, designed into the product.",
          "body": [
            "We mapped Northstar's delivery model before designing screens, then built the workspace around a small set of repeatable actions: plan, assign, approve, and report.",
            "Role-aware views keep each person close to the decisions that matter. Automated status summaries turn live project activity into a clear weekly client update."
          ]
        },
        "outcomes": [
          "A single source of truth across every active engagement",
          "Faster weekly reporting with less manual coordination",
          "A client experience that feels as considered as the consulting work"
        ]
      }
    $story$::jsonb
    else story
  end
where kind = 'project'
  and slug = 'northstar-operations';

update public.products
set
  sort_order = case when sort_order = 0 then 70 else sort_order end,
  client = coalesce(nullif(client, ''), 'Independent homeware label'),
  duration = coalesce(nullif(duration, ''), '12 weeks'),
  engagement = coalesce(
    nullif(engagement, ''),
    'Commerce strategy, design & build'
  ),
  story = case
    when story = '{}'::jsonb then $story$
      {
        "intro": "Maison Mizu needed an online flagship with the atmosphere of its physical spaces and the clarity of its best retail conversations. We made editorial discovery and effortless shopping part of the same journey.",
        "challenge": {
          "title": "A rich brand story trapped inside a standard storefront.",
          "body": [
            "The existing shop treated every object as a row in a catalog. Customers could purchase, but they could not feel the material, provenance, or point of view that made the collection distinctive.",
            "The team also needed a publishing system flexible enough for launches, seasonal edits, and multiple markets without rebuilding pages each time."
          ]
        },
        "solution": {
          "title": "Editorial pace with commerce discipline underneath.",
          "body": [
            "We created a modular visual system that moves naturally from a story into a collection and from a collection into a product. Quiet typography and tactile compositions give each piece room to speak.",
            "Behind the scenes, Shopify and Sanity keep inventory, localized content, and campaign storytelling independent while the front end makes the experience feel seamless."
          ]
        },
        "outcomes": [
          "A distinctive flagship that carries the brand beyond the product grid",
          "A faster path from collection discovery to checkout",
          "A flexible launch system the internal team can shape without code"
        ]
      }
    $story$::jsonb
    else story
  end
where kind = 'project'
  and slug = 'maison-mizu';

create index if not exists products_portfolio_order_idx
  on public.products (sort_order, updated_at desc)
  where kind = 'project';

revoke all on table public.products from anon, authenticated;
grant select (
  id,
  slug,
  name,
  tagline,
  description,
  kind,
  category,
  price,
  price_label,
  featured,
  badge,
  theme,
  accent,
  metrics,
  stack,
  pages,
  features,
  status,
  created_at,
  updated_at,
  published_at,
  sort_order,
  cover_image_url,
  client,
  duration,
  engagement,
  story,
  seo_title,
  seo_description
)
  on table public.products to anon, authenticated;
grant insert, update, delete on table public.products to authenticated;

drop policy if exists "Admins can read all products" on public.products;
create policy "Admins can read all products"
on public.products
for select
to authenticated
using ((select private.is_admin()));

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
on public.products
for insert
to authenticated
with check ((select private.is_admin()));

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
on public.products
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
on public.products
for delete
to authenticated
using ((select private.is_admin()));

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'portfolio',
  'portfolio',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins can read portfolio media" on storage.objects;
create policy "Admins can read portfolio media"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'portfolio'
  and (select private.is_admin())
);

drop policy if exists "Admins can upload portfolio media" on storage.objects;
create policy "Admins can upload portfolio media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'portfolio'
  and (select private.is_admin())
);

drop policy if exists "Admins can update portfolio media" on storage.objects;
create policy "Admins can update portfolio media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'portfolio'
  and (select private.is_admin())
)
with check (
  bucket_id = 'portfolio'
  and (select private.is_admin())
);

drop policy if exists "Admins can delete portfolio media" on storage.objects;
create policy "Admins can delete portfolio media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'portfolio'
  and (select private.is_admin())
);

commit;
