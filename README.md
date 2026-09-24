# Ennearock SaaS Studio

A production-minded SaaS and web-studio starter built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4. It includes a complete marketing site, product catalog, case studies, authentication UI, user workspace, contact workflow, API endpoints, and a Supabase-ready database schema.

## Included routes

- `/` — editorial studio landing page
- `/templates` and `/templates/[slug]` — searchable template collection and details
- `/projects` and `/projects/[slug]` — client work and case studies
- `/products` — unified template/project product database
- `/contact` — validated inquiry form with email delivery or safe fallback
- `/login` and `/signup` — Supabase email/password authentication flows
- `/account/*` — private client workspace: overview, project drafts, requests, and profile
- `/dashboard/*` — protected admin workspace, homepage editor, and portfolio manager
- `/api/products` and `/api/products/[slug]` — filterable catalog API
- `/api/contact` — contact delivery endpoint

## Local development

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The project targets Node.js 24 and keeps the Next.js application at the repository root, so these commands run directly after cloning the repository.

## Environment

The public site works without external credentials by falling back to typed local content, and the contact form offers an email-client fallback. Authentication and persistent admin editing require Supabase. Fill in `.env.local` using `.env.example`:

- Supabase URL and publishable key for persistent auth/data
- optional server-only Supabase service role key for trusted contact writes
- optional comma-separated `ADMIN_EMAILS` route-access fallback
- Resend API key and verified sender for contact delivery
- the fixed Ennearock team destination email

Never expose the service role or email-provider key through a `NEXT_PUBLIC_` variable.

The bundled public-content fallback is an availability safeguard: it is used when Supabase is not configured, the schema is not installed, or a public read cannot complete. This keeps the marketing site online during setup or a provider interruption, but it can briefly show the bundled starter catalog until the connection recovers.

## Deployment

Import the repository directly into a Next.js-capable host such as Vercel or Netlify. The application is at the repository root, so leave the provider root directory and output directory at their defaults. Add the values from `.env.example` in the provider's environment-variable settings, then deploy the `main` branch.

GitHub Pages is not a compatible target for the complete application because the contact and product APIs require a server runtime.
If Vercel is the production host, disable GitHub Pages under **Repository Settings > Pages**. GitHub's generated Pages workflow is otherwise redundant and may emit runtime warnings that cannot be changed from this repository.

## Database

Apply the SQL migrations in timestamp order through the Supabase CLI or dashboard after creating a project:

- `20260830000100_initial_saas_catalog.sql` creates profiles, products, user projects, inquiries, and the initial catalog.
- `20260906000100_admin_content.sql` adds admin roles, editable site content, portfolio fields, the media bucket, and admin-only RLS policies.
- `20260924200204_client_contact_requests.sql` lets authenticated clients submit their own requests without changing ownership, status, or internal metadata.

The authenticated server client is used for both client and admin workspace reads and writes, so database RLS remains the final authorization boundary. The optional service-role key is used by the separate public contact endpoint; it is not required for the client workspace. Never use a service-role client to bypass a member's permissions.

## Client access

Email/password signup and enabled OAuth providers create normal member accounts. After email confirmation or Google sign-in, members land on `/account`; admins default to `/dashboard`. Safe links into an allowed workspace are preserved. A member following an admin link is sent to their client space instead of being signed out.

Clients can edit their own name, company, and website, create private project drafts, and submit and view their own requests. Project creation does not purchase a service or deploy a website. Each list shows up to 100 recent records. Account pages are private, not indexed, and never stored in a shared data cache.

Requests are stored in `public.contact_inquiries` with a verified account owner and email. The team can review and update their status through the Supabase dashboard; this version does not include an admin inbox, email notifications, or chat. Requests previously submitted through the public contact form are not automatically assigned to a client account.

## Admin setup

1. Set `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
2. Apply the migrations in timestamp order, then create and confirm the intended Supabase Auth user.
3. In **Supabase > Authentication > Users**, find your own account and copy its UUID. In the SQL Editor, replace the placeholder UUID below with that exact value and run:

```sql
update public.profiles
set role = 'admin'
where id = '00000000-0000-0000-0000-000000000000'
returning id, email, role;
```

Use the real UUID, not an email address. The `role` column is intentionally excluded from user-editable grants. `ADMIN_EMAILS` and `CONTACT_TEAM_EMAIL` are accepted as server-side route-access fallbacks, but they do not replace the database role: RLS-protected content writes still require `profiles.role = 'admin'`.

4. Check that exactly one row is returned with your email and `role = admin`. If no row is returned, check the UUID and migrations; do not remove the `where` clause.
5. Sign out, sign back in, and open `https://ennearock.com/dashboard`. An administrator can also visit `/account`; a regular member cannot edit website content or publish portfolio projects.

In Supabase Auth URL configuration, use `https://ennearock.com` as the production Site URL and allow both callback paths for local and production:

```text
http://localhost:3000/auth/confirm**
http://localhost:3000/auth/callback**
https://ennearock.com/auth/confirm
https://ennearock.com/auth/callback
```

For server-side token-hash confirmation, set the Confirm signup email template link to:

```text
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
```

The confirmation endpoint also accepts a PKCE `code` callback. Keep production
callback entries exact; the local entries retain wildcards for development.
Keep the production Site URL set to `https://ennearock.com` so an invalid or
unmatched redirect can never fall back to localhost.

To enable Google sign-in:

1. Create a Web OAuth client in Google Auth Platform.
2. Add the Supabase callback URL shown on **Supabase > Authentication > Sign In / Providers > Google** as a Google authorized redirect URI. It has the form `https://PROJECT_REF.supabase.co/auth/v1/callback`.
3. Add the Google client ID and client secret to that Supabase provider and enable it.
4. Keep the application `/auth/callback` URLs above in Supabase's redirect allow list.

Configure custom SMTP before production email signup. Supabase's built-in sender only delivers to project-team addresses and is limited to two messages per hour; `RESEND_API_KEY` used by the contact form does not configure Supabase Auth email delivery.

## Verification

```bash
npm run lint
npm test
npm run build
```

For database permission regression checks on Windows with Docker and a local `postgres:17-alpine` image:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/test-client-rls.ps1
```

This runner applies the actual migrations to disposable local Postgres with minimal Auth/Storage schema stubs, checks owner isolation and protected grants, rolls back fixtures, and removes its own test container. It does not use `.env`, connect to your Supabase project, or verify the hosted OAuth/email setup.

Proxy performs session refresh and an optimistic redirect for `/account` and `/dashboard`. Every privileged admin page, data-access function, and Server Action must still call `requireAdmin()`; client pages and actions call `requireAccountUser()` and query only the verified owner. Proxy and hidden UI are not authorization boundaries.
