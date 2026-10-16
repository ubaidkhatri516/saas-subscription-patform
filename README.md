# Subscript — SaaS Subscription Management Platform

A full-stack SaaS subscription dashboard built with **Next.js 14 (App Router), TypeScript, PostgreSQL, and Stripe Billing**. The interface includes pricing plans, customer dashboard, usage analytics, invoices, and an admin console.

## Features

- Email/password registration and sign-in; passwords hashed with bcrypt.
- Signed, HTTP-only JWT session cookie and server-side role checks.
- Starter, Pro, and Business pricing tiers seeded by the database schema.
- Stripe Checkout for recurring subscriptions and Stripe webhook synchronization.
- Subscription status, period end, and cancel-at-period-end management.
- Usage event API and dashboard usage totals.
- Invoice history with Stripe-hosted invoice links.
- Admin-only plan creation and platform metrics/customer overview.
- Responsive dashboard UI with revenue chart.

## Requirements

- Node.js 18.17+ (Node 20 LTS recommended)
- PostgreSQL 14+
- Stripe account for real checkout testing (use test mode)

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a PostgreSQL database named `saas_subscriptions` (or use your own database URL).
3. Run the schema and seed plans:
   ```bash
   psql "$DATABASE_URL" -f database/schema.sql
   ```
   On Windows, you can open `database/schema.sql` in pgAdmin's Query Tool and execute it against your database.
4. Copy `.env.example` to `.env.local` and set `DATABASE_URL` and a random `JWT_SECRET` of at least 32 characters. Set `NEXT_PUBLIC_APP_URL=http://localhost:3000`.
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open http://localhost:3000 and create a customer account.

> The database is required for registration, authentication, plans, invoices, and dashboard data. The UI is not a static mockup; pages call the included API routes.

## Configure Stripe test mode

1. Create a Stripe account and ensure **test mode** is enabled.
2. In Stripe Products, create recurring monthly prices for Pro and Business. Copy each `price_...` ID into `STRIPE_PRICE_PRO` and `STRIPE_PRICE_BUSINESS` in `.env.local`.
3. Set `STRIPE_SECRET_KEY` to your test secret key (`sk_test_...`).
4. Start the app, then in another terminal run:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   Copy the displayed `whsec_...` signing secret into `STRIPE_WEBHOOK_SECRET` and restart the app.
5. In the Stripe dashboard, enable or test the following webhook events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
6. Select a paid plan in the app. Use Stripe's test card `4242 4242 4242 4242`, any future expiry, and any CVC.

The Starter plan is free and doesn't need Stripe. Paid checkout intentionally returns a clear error until a Stripe Price ID is configured.

## Create an administrator

Registration intentionally never lets a public visitor choose an admin role. Create a normal account through the app, then promote it from a trusted database session:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
```

Sign out and sign in again to refresh the session role. Do not expose a public admin-registration form.

## Usage API example

With a signed-in browser session, record usage from the app or an API client:

```http
POST /api/usage
Content-Type: application/json

{"event_type":"report_generated","quantity":1,"metadata":{"format":"csv"}}
```

`GET /api/usage` returns the signed-in user's current-month usage grouped by event type. Protect this endpoint with the session; production systems should also add per-plan quota enforcement and idempotency controls before counting billable usage.

## API routes

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create a customer account |
| POST | `/api/auth/login` | Authenticate a user |
| POST | `/api/auth/logout` | Clear the session cookie |
| GET | `/api/subscriptions` | Current user's subscription and usage |
| POST | `/api/checkout` | Create a Stripe Checkout Session |
| POST | `/api/cancel` | Cancel a Stripe subscription at period end |
| GET / POST | `/api/usage` | Read or record usage events |
| GET | `/api/invoices` | Invoice list (admins can see all) |
| GET / POST | `/api/admin/plans` | List plans / create plan (admin-only creation) |
| POST | `/api/webhooks/stripe` | Verify and process Stripe events |

## Deploying

- Provision managed PostgreSQL and apply `database/schema.sql`.
- Add every `.env.example` variable to your hosting provider's environment settings.
- Set `NEXT_PUBLIC_APP_URL` to the production HTTPS origin.
- Configure Stripe webhook endpoint as `https://YOUR_DOMAIN/api/webhooks/stripe` and use its production signing secret.
- Run `npm run build` before deploying.

## Security and production notes

This is a portfolio-ready starter, not a fully audited billing system. Before production use, add rate limiting and abuse protection to authentication, CSRF/origin checks for state-changing routes as appropriate, password reset and email verification, structured logging/monitoring, database migrations/backups, automated tests, and explicit quota enforcement. Review tax/VAT, refunds, proration, failed-payment recovery, and subscription upgrade/downgrade policies. Never commit `.env.local`, Stripe secrets, database credentials, or webhook secrets. Do not trust client-supplied prices; checkout uses server-side plan and Stripe price IDs.
