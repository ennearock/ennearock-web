-- Run only against the throwaway database created by test-client-rls.ps1.
-- The real application migrations are applied before these assertions.
-- All fixture identities, projects, requests and test helpers are rolled back.
begin;

do $$
begin
  if current_database() <> 'ennearock_client_rls_test' then
    raise exception 'Use the isolated test-client-rls.ps1 runner, not a production database';
  end if;
end;
$$;

create function pg_temp.assert_true(result boolean, description text)
returns void
language plpgsql
security invoker
as $$
begin
  if result is distinct from true then
    raise exception 'FAILED: %', description;
  end if;
  raise notice 'PASS: %', description;
end;
$$;

create function pg_temp.expect_denied(statement text, description text)
returns void
language plpgsql
security invoker
as $$
begin
  begin
    execute statement;
  exception when insufficient_privilege then
    raise notice 'PASS: %', description;
    return;
  end;
  raise exception 'FAILED (operation was permitted): %', description;
end;
$$;

insert into auth.users (id, email)
values
  ('f1000000-0000-4000-8000-000000000001', 'alice@rls-test.invalid'),
  ('f1000000-0000-4000-8000-000000000002', 'bob@rls-test.invalid');

select pg_temp.assert_true(
  (select count(*) = 2 from public.profiles
   where id in ('f1000000-0000-4000-8000-000000000001', 'f1000000-0000-4000-8000-000000000002')
     and role = 'member'),
  'new client accounts have member profiles, not administrator roles'
);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"f1000000-0000-4000-8000-000000000001","email":"alice@rls-test.invalid","role":"authenticated"}', true);

insert into public.user_projects (user_id, name)
values ('f1000000-0000-4000-8000-000000000001', 'Alice private project');

select pg_temp.assert_true(
  (select count(*) = 1 from public.user_projects
   where name = 'Alice private project' and status = 'draft'),
  'Alice can insert and read her own project'
);

with updated as (
  update public.profiles set full_name = 'Alice Client', company = 'Alice company'
  where id = 'f1000000-0000-4000-8000-000000000001'
  returning id
)
select pg_temp.assert_true(
  (select count(*) = 1 from updated),
  'Alice can update her own editable profile fields'
);

select pg_temp.assert_true(
  (select full_name = 'Alice Client' and company = 'Alice company'
   from public.profiles where id = 'f1000000-0000-4000-8000-000000000001'),
  'Alice can read her saved profile changes'
);

select pg_temp.expect_denied($test$
  insert into public.site_content (key, content)
  values ('hero', '{"title":"A member must not publish this"}'::jsonb)
  on conflict (key) do nothing
$test$, 'members cannot insert admin-managed site content');

select pg_temp.expect_denied($test$
  insert into public.products (slug, name, tagline, description, kind, category, price_label, accent)
  values ('rls-member-project', 'Member project', 'Private', 'Not authorized for the public catalog', 'project', 'Test', 'Free', '#ffffff')
$test$, 'members cannot insert admin-managed portfolio products');

insert into public.contact_inquiries (user_id, name, email, company, subject, message)
values ('f1000000-0000-4000-8000-000000000001', 'Alice', 'alice@rls-test.invalid', 'Test client', 'Alice request', 'Please help with my project.');

select pg_temp.assert_true(
  (select count(*) = 1 from public.contact_inquiries
   where subject = 'Alice request' and status = 'new' and metadata = '{}'::jsonb),
  'Alice can insert and read her own request, with server-controlled defaults'
);

select pg_temp.expect_denied($test$
  insert into public.contact_inquiries (user_id, name, email, subject, message)
  values ('f1000000-0000-4000-8000-000000000002', 'Alice', 'alice@rls-test.invalid', 'Spoofed owner', 'No')
$test$, 'Alice cannot create a request owned by Bob');

select pg_temp.expect_denied($test$
  insert into public.contact_inquiries (user_id, name, email, subject, message)
  values (null, 'Alice', 'alice@rls-test.invalid', 'No owner', 'No')
$test$, 'clients cannot create an unowned request');

select pg_temp.expect_denied($test$
  insert into public.contact_inquiries (user_id, name, email, subject, message)
  values ('f1000000-0000-4000-8000-000000000001', 'Alice', 'bob@rls-test.invalid', 'Spoofed email', 'No')
$test$, 'Alice cannot impersonate another email address');

select pg_temp.expect_denied($test$
  insert into public.contact_inquiries (user_id, name, email, subject, message, status)
  values ('f1000000-0000-4000-8000-000000000001', 'Alice', 'alice@rls-test.invalid', 'Spoofed status', 'No', 'resolved')
$test$, 'clients cannot set the request status');

select pg_temp.expect_denied($test$
  insert into public.contact_inquiries (user_id, name, email, subject, message, metadata)
  values ('f1000000-0000-4000-8000-000000000001', 'Alice', 'alice@rls-test.invalid', 'Spoofed metadata', 'No', '{"priority":"admin"}'::jsonb)
$test$, 'clients cannot set internal metadata');

select pg_temp.expect_denied($test$
  insert into public.contact_inquiries (id, user_id, name, email, subject, message)
  values ('f1000000-0000-4000-8000-000000000003', 'f1000000-0000-4000-8000-000000000001', 'Alice', 'alice@rls-test.invalid', 'Spoofed id', 'No')
$test$, 'clients cannot choose request IDs');

select pg_temp.expect_denied($test$
  insert into public.contact_inquiries (user_id, name, email, subject, message, created_at)
  values ('f1000000-0000-4000-8000-000000000001', 'Alice', 'alice@rls-test.invalid', 'Spoofed time', 'No', now())
$test$, 'clients cannot choose request timestamps');

select pg_temp.expect_denied($test$
  update public.contact_inquiries set status = 'resolved' where subject = 'Alice request'
$test$, 'clients cannot update even their own request status');

select pg_temp.expect_denied($test$
  delete from public.contact_inquiries where subject = 'Alice request'
$test$, 'clients cannot delete requests');

select pg_temp.expect_denied($test$
  update public.profiles set role = 'admin' where id = 'f1000000-0000-4000-8000-000000000001'
$test$, 'a member cannot self-promote to administrator');

select set_config('request.jwt.claims', '{"sub":"f1000000-0000-4000-8000-000000000002","email":"bob@rls-test.invalid","role":"authenticated"}', true);

select pg_temp.assert_true(
  (select count(*) = 0 from public.user_projects where name = 'Alice private project'),
  'Bob cannot read Alice private project'
);

with updated as (
  update public.user_projects set name = 'Changed by Bob'
  where user_id = 'f1000000-0000-4000-8000-000000000001'
  returning id
)
select pg_temp.assert_true(
  (select count(*) = 0 from updated),
  'Bob cannot update Alice project (zero affected rows)'
);

select pg_temp.expect_denied($test$
  insert into public.user_projects (user_id, name)
  values ('f1000000-0000-4000-8000-000000000001', 'Spoofed project owner')
$test$, 'Bob cannot create a project owned by Alice');

select pg_temp.assert_true(
  (select count(*) = 0 from public.profiles
   where id = 'f1000000-0000-4000-8000-000000000001'),
  'Bob cannot read Alice profile'
);

with updated as (
  update public.profiles set full_name = 'Changed by Bob'
  where id = 'f1000000-0000-4000-8000-000000000001'
  returning id
)
select pg_temp.assert_true(
  (select count(*) = 0 from updated),
  'Bob cannot update Alice profile (zero affected rows)'
);

select pg_temp.assert_true(
  (select count(*) = 0 from public.contact_inquiries where subject = 'Alice request'),
  'Bob cannot read Alice request'
);

insert into public.contact_inquiries (user_id, name, email, subject, message)
values ('f1000000-0000-4000-8000-000000000002', 'Bob', 'bob@rls-test.invalid', 'Bob request', 'A separate project.');

select pg_temp.assert_true(
  (select count(*) = 1 from public.contact_inquiries where subject = 'Bob request'),
  'Bob can create and read his own request'
);

select set_config('request.jwt.claims', '{"sub":"f1000000-0000-4000-8000-000000000001","email":"alice@rls-test.invalid","role":"authenticated"}', true);
select pg_temp.assert_true(
  (select count(*) = 0 from public.contact_inquiries where subject = 'Bob request'),
  'Alice cannot read Bob request'
);

select set_config('request.jwt.claims', '{"email":"alice@rls-test.invalid","role":"authenticated"}', true);
select pg_temp.expect_denied($test$
  insert into public.contact_inquiries (user_id, name, email, subject, message)
  values ('f1000000-0000-4000-8000-000000000001', 'Alice', 'alice@rls-test.invalid', 'Missing identity', 'No')
$test$, 'the authenticated role alone without a user identity grants no insert access');

select set_config('request.jwt.claims', '{"sub":"f1000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select pg_temp.expect_denied($test$
  insert into public.contact_inquiries (user_id, name, email, subject, message)
  values ('f1000000-0000-4000-8000-000000000001', 'Alice', 'alice@rls-test.invalid', 'Missing email', 'No')
$test$, 'an account without an email claim cannot submit requests');

set local role anon;
select set_config('request.jwt.claims', '{}', true);
select pg_temp.expect_denied('select * from public.contact_inquiries', 'signed-out visitors cannot read client requests');
select pg_temp.expect_denied($test$
  insert into public.contact_inquiries (name, email, subject, message)
  values ('Visitor', 'visitor@rls-test.invalid', 'Anonymous insert', 'No')
$test$, 'signed-out visitors cannot directly insert requests');
select pg_temp.expect_denied('update public.contact_inquiries set status = ''resolved''', 'signed-out visitors cannot update requests');
select pg_temp.expect_denied('delete from public.contact_inquiries', 'signed-out visitors cannot delete requests');

set local role service_role;
insert into public.contact_inquiries (name, email, subject, message, status, metadata)
values ('Visitor', 'visitor@rls-test.invalid', 'Server contact form', 'Validated by server.', 'in-progress', '{"source":"contact-form"}'::jsonb);
update public.contact_inquiries set status = 'in-progress' where subject = 'Alice request';
select pg_temp.assert_true(
  (select count(*) = 3 from public.contact_inquiries
   where subject in ('Alice request', 'Bob request', 'Server contact form')),
  'the server-only service role retains the existing contact workflow'
);
select pg_temp.assert_true(
  (select status = 'in-progress' from public.contact_inquiries where subject = 'Alice request'),
  'the service role can still manage request status'
);

reset role;
rollback;
