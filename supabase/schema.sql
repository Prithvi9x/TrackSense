-- Ledger: personal expense tracker

create extension if not exists "pgcrypto";

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  category text not null check (
    category in ('Bus', 'Train', 'Auto Rickshaw', 'Food', 'Other')
  ),
  custom_category text,
  date date not null,
  payment_method text not null check (
    payment_method in ('UPI', 'Cash', 'Other')
  ),
  custom_payment_method text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- custom_category is only meaningful when category = 'Other'
  constraint custom_category_only_when_other check (
    (category = 'Other' and custom_category is not null and length(trim(custom_category)) > 0)
    or (category <> 'Other' and custom_category is null)
  ),
  -- custom_payment_method is only meaningful when payment_method = 'Other'
  constraint custom_payment_only_when_other check (
    (payment_method = 'Other' and custom_payment_method is not null and length(trim(custom_payment_method)) > 0)
    or (payment_method <> 'Other' and custom_payment_method is null)
  )
);

-- Indexes for the common access patterns: per-user listing, date filtering,
-- and category filtering.
create index if not exists expenses_user_id_idx on public.expenses (user_id);
create index if not exists expenses_user_date_idx on public.expenses (user_id, date desc);
create index if not exists expenses_user_category_idx on public.expenses (user_id, category);

-- Keep updated_at current on every update.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists expenses_set_updated_at on public.expenses;
create trigger expenses_set_updated_at
  before update on public.expenses
  for each row
  execute function public.set_updated_at();

-- Row Level Security: every query is restricted to the authenticated user's
-- own rows. Without policies below, RLS blocks all access by default.
alter table public.expenses enable row level security;

create policy "Users can view their own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own expenses"
  on public.expenses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);
