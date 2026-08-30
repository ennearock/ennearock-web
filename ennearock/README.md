# Ennearock SaaS Studio

A production-minded SaaS and web-studio starter built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4. It includes a complete marketing site, product catalog, case studies, authentication UI, user workspace, contact workflow, API endpoints, and a Supabase-ready database schema.

## Included routes

- `/` — editorial studio landing page
- `/templates` and `/templates/[slug]` — searchable template collection and details
- `/projects` and `/projects/[slug]` — client work and case studies
- `/products` — unified template/project product database
- `/contact` — validated inquiry form with email delivery or safe fallback
- `/login` and `/signup` — polished demo authentication flows
- `/dashboard/*` — overview, projects, templates, billing, and settings
- `/api/products` and `/api/products/[slug]` — filterable catalog API
- `/api/contact` — contact delivery endpoint

## Local development

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

The site works without external credentials: catalog data uses the typed local seed and the contact form offers an email-client fallback. For production, fill in `.env.local` using `.env.example`:

- Supabase URL and publishable key for persistent auth/data
- server-only Supabase service role key for trusted contact writes
- Resend API key and verified sender for contact delivery
- the fixed Ennearock team destination email

Never expose the service role or email-provider key through a `NEXT_PUBLIC_` variable.

## Database

`supabase/migrations/20260830000100_initial_saas_catalog.sql` defines profiles, products, user projects, contact inquiries, indexes, triggers, grants, row-level security policies, and the initial catalog seed. Apply it through the Supabase CLI or dashboard after creating a project.

## Verification

```bash
npm run lint
npm run build
```

The login and sign-up pages intentionally run in demo mode until a real authentication provider is configured. Do not treat the client-side demo redirect as an authorization boundary; protect dashboard routes server-side when connecting production auth.
