alter table farmer_requests
  add column if not exists expires_at timestamptz not null default now() + interval '10 days',
  add column if not exists ignored_by_operator_ids text[] not null default '{}';
