begin;

create extension if not exists pgcrypto with schema extensions;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  company text,
  website text,
  plan text not null default 'free'
    check (plan in ('free', 'pro', 'studio')),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  tagline text not null,
  description text not null,
  kind text not null
    check (kind in ('template', 'project')),
  category text not null,
  price numeric(12, 2) not null default 0
    check (price >= 0),
  price_label text not null,
  featured boolean not null default false,
  badge text,
  theme text not null default 'light'
    check (theme in ('light', 'dark', 'warm')),
  accent text not null
    check (accent ~ '^#[0-9A-Fa-f]{6}$'),
  metrics jsonb not null default '[]'::jsonb
    check (jsonb_typeof(metrics) = 'array'),
  stack text[] not null default '{}'::text[],
  pages text[] not null default '{}'::text[],
  features text[] not null default '{}'::text[],
  status text not null default 'available'
    check (status in ('available', 'case-study', 'coming-soon')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table public.user_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  name text not null,
  status text not null default 'draft'
    check (status in ('draft', 'active', 'paused', 'completed', 'archived')),
  subdomain text
    check (subdomain is null or subdomain ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  custom_domain text,
  settings jsonb not null default '{}'::jsonb
    check (jsonb_typeof(settings) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  name text not null,
  email text not null,
  company text,
  subject text not null,
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'in-progress', 'resolved', 'spam')),
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_kind_category_idx
  on public.products (kind, category);
create index products_status_updated_at_idx
  on public.products (status, updated_at desc);
create index products_featured_idx
  on public.products (featured, updated_at desc)
  where featured = true;
create index user_projects_user_status_idx
  on public.user_projects (user_id, status, updated_at desc);
create index user_projects_product_id_idx
  on public.user_projects (product_id)
  where product_id is not null;
create unique index user_projects_subdomain_idx
  on public.user_projects (lower(subdomain))
  where subdomain is not null;
create unique index user_projects_custom_domain_idx
  on public.user_projects (lower(custom_domain))
  where custom_domain is not null;
create index contact_inquiries_status_created_at_idx
  on public.contact_inquiries (status, created_at desc);
create index contact_inquiries_user_id_idx
  on public.contact_inquiries (user_id, created_at desc)
  where user_id is not null;

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger user_projects_set_updated_at
before update on public.user_projects
for each row execute function public.set_updated_at();

create trigger contact_inquiries_set_updated_at
before update on public.contact_inquiries
for each row execute function public.set_updated_at();

create function public.handle_ennearock_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger ennearock_on_auth_user_created
after insert on auth.users
for each row execute function public.handle_ennearock_new_user();

revoke all on function public.handle_ennearock_new_user() from public;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.user_projects enable row level security;
alter table public.contact_inquiries enable row level security;

create policy "Profiles are readable by their owner"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Profiles are insertable by their owner"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "Profiles are updateable by their owner"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Published catalog is publicly readable"
on public.products
for select
to anon, authenticated
using (published_at is not null);

create policy "User projects are readable by their owner"
on public.user_projects
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "User projects are insertable by their owner"
on public.user_projects
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "User projects are updateable by their owner"
on public.user_projects
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "User projects are deletable by their owner"
on public.user_projects
for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "Contact inquiries are readable by their owner"
on public.contact_inquiries
for select
to authenticated
using ((select auth.uid()) = user_id);

grant select on table public.products to anon, authenticated;
grant select on table public.profiles to authenticated;
grant insert (id, email, full_name, avatar_url, company, website, onboarding_completed)
  on table public.profiles to authenticated;
grant update (full_name, avatar_url, company, website, onboarding_completed, updated_at)
  on table public.profiles to authenticated;
grant select, insert, update, delete on table public.user_projects to authenticated;
grant select on table public.contact_inquiries to authenticated;

-- Contact writes intentionally have no anon/authenticated grant. The validated
-- server route inserts them with a server-only service role credential.

insert into public.products (
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
  updated_at,
  published_at
)
values
  (
    '10000000-0000-4000-8000-000000000001',
    'nexus-workspace',
    'Nexus Workspace',
    'A calm operating system for ambitious teams.',
    'A conversion-focused SaaS kit with a polished marketing site, collaborative workspace, analytics, billing, and account settings.',
    'template',
    'SaaS',
    129.00,
    '€129',
    true,
    'Best seller',
    'light',
    '#7C5CFC',
    '[{"label":"Screens","value":"34"},{"label":"Components","value":"80+"}]'::jsonb,
    array['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    array['Landing', 'Pricing', 'Dashboard', 'Projects', 'Billing'],
    array['Responsive application shell', 'Team and project workflows', 'Subscription-ready pricing', 'Accessible UI states'],
    'available',
    '2026-08-24T00:00:00Z',
    '2026-08-24T00:00:00Z'
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'atelier-folio',
    'Atelier Folio',
    'Editorial storytelling for independent creatives.',
    'A refined portfolio system for studios, designers, and photographers, built around generous typography and immersive project stories.',
    'template',
    'Portfolio',
    89.00,
    '€89',
    false,
    null,
    'warm',
    '#E16B4A',
    '[{"label":"Layouts","value":"18"},{"label":"CMS collections","value":"4"}]'::jsonb,
    array['Next.js', 'TypeScript', 'Tailwind CSS', 'MDX'],
    array['Home', 'Work', 'Case study', 'Studio', 'Journal', 'Contact'],
    array['Modular case studies', 'Journal and project collections', 'Subtle motion system', 'Image-first responsive layouts'],
    'available',
    '2026-08-17T00:00:00Z',
    '2026-08-17T00:00:00Z'
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    'pulsecare-clinic',
    'PulseCare Clinic',
    'Digital care journeys patients can trust.',
    'A reassuring healthcare template for modern clinics, with practitioner discovery, appointment flows, patient resources, and service pages.',
    'template',
    'Healthcare',
    149.00,
    '€149',
    true,
    'New',
    'light',
    '#1FA58A',
    '[{"label":"Pages","value":"22"},{"label":"Booking steps","value":"3"}]'::jsonb,
    array['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
    array['Services', 'Practitioners', 'Booking', 'Resources', 'Patient portal'],
    array['Practitioner directory', 'Appointment request flow', 'Patient-friendly content blocks', 'Privacy-conscious form patterns'],
    'available',
    '2026-08-28T00:00:00Z',
    '2026-08-28T00:00:00Z'
  ),
  (
    '10000000-0000-4000-8000-000000000004',
    'cartlane-commerce',
    'Cartlane Commerce',
    'A storefront tuned for discovery and repeat sales.',
    'A high-performance commerce foundation with rich collections, product storytelling, cart flows, customer accounts, and merchandising blocks.',
    'template',
    'E-commerce',
    139.00,
    '€139',
    true,
    'Popular',
    'dark',
    '#E8FF65',
    '[{"label":"Sections","value":"42"},{"label":"Store flows","value":"9"}]'::jsonb,
    array['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe'],
    array['Store', 'Collection', 'Product', 'Cart', 'Account', 'Journal'],
    array['Collection filtering', 'Variant-rich product pages', 'Persistent cart patterns', 'Campaign landing sections'],
    'available',
    '2026-08-12T00:00:00Z',
    '2026-08-12T00:00:00Z'
  ),
  (
    '10000000-0000-4000-8000-000000000005',
    'orbit-ai-studio',
    'Orbit AI Studio',
    'Turn powerful AI workflows into an intuitive product.',
    'A complete interface kit for AI products, combining prompt workspaces, usage insights, model controls, onboarding, and plan management.',
    'template',
    'AI',
    159.00,
    '€159',
    true,
    'Editor''s pick',
    'dark',
    '#8B7CFF',
    '[{"label":"Product screens","value":"28"},{"label":"AI states","value":"16"}]'::jsonb,
    array['Next.js', 'TypeScript', 'Tailwind CSS', 'OpenAI'],
    array['Landing', 'Playground', 'Library', 'Usage', 'Team', 'Settings'],
    array['Prompt and generation workspace', 'Streaming response states', 'Usage and credit dashboards', 'Model configuration patterns'],
    'available',
    '2026-08-29T00:00:00Z',
    '2026-08-29T00:00:00Z'
  ),
  (
    '10000000-0000-4000-8000-000000000006',
    'ledgerly-finance',
    'Ledgerly Finance',
    'Financial clarity without the spreadsheet fatigue.',
    'A trustworthy fintech dashboard for cash flow, budgets, transactions, and reports, with a marketing site and guided onboarding.',
    'template',
    'Fintech',
    169.00,
    '€169',
    false,
    'Coming soon',
    'light',
    '#2C6BED',
    '[{"label":"Dashboards","value":"12"},{"label":"Chart patterns","value":"14"}]'::jsonb,
    array['Next.js', 'TypeScript', 'Tailwind CSS', 'Recharts'],
    array['Overview', 'Transactions', 'Budgets', 'Reports', 'Connections'],
    array['Cash-flow overview', 'Transaction categorization', 'Budget progress states', 'Export-ready reporting'],
    'coming-soon',
    '2026-08-22T00:00:00Z',
    '2026-08-22T00:00:00Z'
  ),
  (
    '10000000-0000-4000-8000-000000000007',
    'northstar-operations',
    'Northstar Operations',
    'One shared view for a fast-moving operations team.',
    'A custom operations platform that unified planning, client delivery, documents, and weekly reporting for a distributed consultancy.',
    'project',
    'SaaS',
    0.00,
    'Case study',
    true,
    'Client project',
    'dark',
    '#FFB547',
    '[{"label":"Admin time","value":"-42%"},{"label":"Adoption","value":"96%"}]'::jsonb,
    array['Next.js', 'TypeScript', 'Supabase', 'Vercel'],
    array['Workspace', 'Clients', 'Delivery', 'Reports', 'Admin'],
    array['Role-aware workspaces', 'Automated status reporting', 'Document approval flows', 'Operational analytics'],
    'case-study',
    '2026-07-30T00:00:00Z',
    '2026-07-30T00:00:00Z'
  ),
  (
    '10000000-0000-4000-8000-000000000008',
    'maison-mizu',
    'Maison Mizu',
    'A tactile digital flagship for a modern homeware label.',
    'A custom commerce experience pairing editorial collections with a frictionless shop, localized content, and a flexible launch system.',
    'project',
    'E-commerce',
    0.00,
    'Case study',
    false,
    'Client project',
    'warm',
    '#C55A3D',
    '[{"label":"Conversion","value":"+31%"},{"label":"Load time","value":"1.2s"}]'::jsonb,
    array['Next.js', 'TypeScript', 'Shopify', 'Sanity'],
    array['Home', 'Collections', 'Product', 'Stories', 'Cart'],
    array['Editorial commerce system', 'Localized product catalog', 'Composable content sections', 'Performance-focused media'],
    'case-study',
    '2026-08-05T00:00:00Z',
    '2026-08-05T00:00:00Z'
  )
on conflict (slug) do update
set
  name = excluded.name,
  tagline = excluded.tagline,
  description = excluded.description,
  kind = excluded.kind,
  category = excluded.category,
  price = excluded.price,
  price_label = excluded.price_label,
  featured = excluded.featured,
  badge = excluded.badge,
  theme = excluded.theme,
  accent = excluded.accent,
  metrics = excluded.metrics,
  stack = excluded.stack,
  pages = excluded.pages,
  features = excluded.features,
  status = excluded.status,
  updated_at = excluded.updated_at,
  published_at = excluded.published_at;

commit;
