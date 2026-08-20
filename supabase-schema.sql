create table if not exists public.study_records (
  user_id uuid not null references auth.users(id) on delete cascade,
  record_date date not null,
  status text not null check (status in ('未开始', '部分完成', '完成')),
  minutes integer not null default 0 check (minutes between 0 and 300),
  mastery integer not null default 3 check (mastery between 1 and 5),
  notes text not null default '',
  artifact text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, record_date)
);

alter table public.study_records enable row level security;

revoke all on table public.study_records from anon;
grant select, insert, update, delete on table public.study_records to authenticated;

drop policy if exists "Users can read their own study records" on public.study_records;
create policy "Users can read their own study records"
on public.study_records for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own study records" on public.study_records;
create policy "Users can create their own study records"
on public.study_records for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own study records" on public.study_records;
create policy "Users can update their own study records"
on public.study_records for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
