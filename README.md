# TrackSense - Personal Expense Tracker

A lightweight personal expense tracker for daily spending (bus, train, auto rickshaw,
food, and anything else). Built with React, Vite, Tailwind CSS, Supabase, and Recharts.
Deploys as a static site on GitHub Pages — no custom backend.

## Features

- Email/password auth via Supabase Auth, with Row Level Security so each user
  only ever sees their own data.
- Dashboard with today / this week / this month totals, expense count, highest
  category, a category donut chart, a spending-over-time chart, and a recent
  expenses list.
- Quick "Add expense" form (amount, category, date, payment method), with a
  free-text field when "Other" is chosen for category or payment method.
- Searchable, filterable expense history with edit and delete (delete asks for
  confirmation first).
- Settings page with account info, CSV/JSON export, and CSV/JSON import for backups.
- Clean, minimal, light-themed UI that works well on both mobile and desktop.

## Tech stack

- React + Vite
- Tailwind CSS
- Supabase (PostgreSQL + Auth), called directly from the frontend
- Recharts for the dashboard charts
- React Router (`HashRouter`, for GitHub Pages compatibility)

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the contents of [`supabase/schema.sql`](supabase/schema.sql).
   This creates the `expenses` table, indexes, and Row Level Security policies.
3. In **Authentication > Providers**, make sure **Email** is enabled.
   - For quick local testing, you can disable "Confirm email" under
     **Authentication > Settings** so new accounts can sign in immediately.
4. In **Project Settings > API**, copy the **Project URL** and **anon public key**.

## 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

These are safe to expose in a static frontend — the anon key only grants what
Row Level Security allows, which is "a signed-in user can access their own rows."

## 3. Install and run locally

```bash
npm install
npm run dev
```

Visit the printed local URL, create an account, and start adding expenses.

## Project structure

```
src/
  components/    Reusable UI (Layout/nav, ExpenseForm, charts, dialogs)
  hooks/         useAuth (session/auth actions), useExpenses (CRUD queries)
  lib/           Supabase client
  pages/         Dashboard, AddExpense, History, Settings, Login
  utils/         Constants, date-range helpers, CSV/JSON import-export
supabase/
  schema.sql     Table definition, indexes, and RLS policies
```

State is kept simple on purpose: local component state and a couple of small
React context/hooks for auth and data — no Redux or other global state library.

## Notes on data across devices

Because all data lives in Supabase and the frontend talks to it directly, the
same account shows the same expenses on any device — phone, tablet, or desktop
— as soon as you sign in.

## What this app intentionally does not do

This is a personal expense log, not an accounting platform: no budgeting
system, investment tracking, bank integrations, AI features, notifications,
recurring payments, or multi-user collaboration. The focus stays on: add
expense → store it → view it → edit/delete it → filter it → visualize it →
back it up.
