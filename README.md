# Sanctified Studio

A photography studio platform for **wedding** and **baby shower** photography.
Public marketing site + a private admin panel for client, employee, and finance management.

> _Moments worth keeping._

## Stack

- **Next.js 16** (App Router, TypeScript) · **React 19**
- **Tailwind CSS v4** (CSS-first `@theme` tokens) + hand-rolled shadcn-style UI primitives
- **PostgreSQL (Neon)** via **Prisma 6**
- **NextAuth v5** (credentials provider, admin-only, JWT sessions)
- **Nodemailer** (proposal + invoice email) · **@react-pdf/renderer** (PDFs)
- **Cloudinary** (gallery images) · **motion** (scroll reveal)
- Fonts: **Fraunces** (display) + **Inter** (body)

> Note: `create-next-app@latest` provisioned Next 16 / React 19 / Tailwind v4 rather
> than the Next 14 / Tailwind 3 named in the original spec. Prisma is pinned to v6 so the
> schema matches the spec verbatim. Admin data mutations use **server actions**; the public
> surface (`/api/enquiry`, `/api/finance`) and PDF downloads are **route handlers**.

## Getting started

1. **Install**

   ```bash
   npm install
   ```

2. **Environment** — copy `.env.example` to `.env` and fill in:

   - `DATABASE_URL` — Neon **pooled** connection string
   - `DIRECT_URL` — Neon **direct** connection (host without `-pooler`); used by `prisma migrate`
   - `NEXTAUTH_SECRET` / `AUTH_SECRET` — `openssl rand -base64 32`
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — seeded admin login
   - `SMTP_*` — for sending proposal/invoice emails (optional; UI surfaces a clear error if absent)
   - `CLOUDINARY_*` — for gallery uploads (optional; admin shows a notice if absent)

3. **Database**

   ```bash
   npx prisma migrate dev      # apply schema
   npx prisma db seed          # seed admin + demo employees
   ```

4. **Run**

   ```bash
   npm run dev                 # http://localhost:3000
   ```

   Admin panel: **/admin/login** (use `ADMIN_EMAIL` / `ADMIN_PASSWORD`).

## The admin flow

```
Website enquiry → LEAD → (qualify) POSITIVE
  → create Event → build Proposal (editable price page) → PDF → email  [PROPOSAL_SENT]
  → record advance payment  [ADVANCE_RECEIVED]
  → assign employees + per-person payouts
  → create Invoice (advance + balance due) → PDF → email
  → record final payment, mark payouts paid, complete event  [COMPLETED]
```

Finance dashboard (`/admin/finance`) aggregates received vs. paid by month/year,
with per-employee and per-event breakdowns.

## Scripts

- `npm run db:migrate` / `db:seed` / `db:studio`
- `scripts/verify-pdf.ts` — authenticated end-to-end check of the PDF routes (dev server must be running):
  `npx tsx scripts/verify-pdf.ts`
- `scripts/verify.ts` — data-layer + finance assertions (needs the react-server condition for `server-only`):
  `node --conditions=react-server --import tsx scripts/verify.ts`

## Display IDs

Clients are `CLT-0001`, employees `EMP-0001` — zero-padded and generated inside a
transaction (`lib/ids.ts`).
