begin;

alter table public.contact_inquiries enable row level security;

-- Older Supabase projects may have broad default grants. Reset both table and
-- column grants before opening only the client-owned request submission path.
-- The server-only service_role grants and existing owner SELECT policy remain.
revoke all on table public.contact_inquiries from public, anon, authenticated;
revoke all (
  id, user_id, name, email, company, subject, message, status, metadata,
  created_at, updated_at
) on table public.contact_inquiries from public, anon, authenticated;

grant select on table public.contact_inquiries to authenticated;
grant insert (user_id, name, email, company, subject, message)
  on table public.contact_inquiries to authenticated;

drop policy if exists "Clients can submit their own contact inquiries"
  on public.contact_inquiries;
create policy "Clients can submit their own contact inquiries"
on public.contact_inquiries
for insert
to authenticated
with check (
  (select auth.uid()) is not null
  and user_id = (select auth.uid())
  and email = nullif((select auth.jwt() ->> 'email'), '')
  and status = 'new'
  and metadata = '{}'::jsonb
);

commit;
