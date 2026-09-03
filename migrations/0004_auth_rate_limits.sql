-- Auth hardening: rate limiting, audit log.
-- Applied by PGLite on startup and by Vercel build migration script.
-- New files only — never edit earlier migrations.

-- 1. Server-side rate limiting for auth attempts (sign-in, sign-up).
--    Tracks failed attempts per phone + action to prevent brute-force.
create table if not exists auth_rate_limits (
  id          text primary key,
  phone       text not null,
  action      text not null check (action in ('sign_in', 'sign_up')),
  attempts    integer not null default 1,
  window_start timestamptz not null default now()
);

create index if not exists auth_rate_limits_phone_action_idx
  on auth_rate_limits (phone, action);

-- 2. Audit log for auth events (sign-in, sign-up, failures, password changes).
create table if not exists audit_log (
  id          text primary key,
  event       text not null,
  phone       text,
  user_id     text,
  ip_address  text,
  user_agent  text,
  detail      text,
  created_at  timestamptz not null default now()
);

create index if not exists audit_log_event_idx on audit_log (event);
create index if not exists audit_log_phone_idx on audit_log (phone);
create index if not exists audit_log_created_at_idx on audit_log (created_at);
