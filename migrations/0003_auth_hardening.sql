-- Auth hardening: phone uniqueness, phone verification status, and OTP storage.
--
-- Applied by PGLite on startup and by Vercel build migration script.
-- New files only — never edit 0001 or 0002.

-- 1. Ensure phone is normalized to E.164 (+91XXXXXXXXXX) before uniqueness check.
--    (Existing rows with bare 10-digit numbers are padded by the app on next save.)

-- 2. Unique phone number per account (one phone → one profile).
--    Uses a partial unique index so multiple NULLs are allowed for legacy rows.
create unique index if not exists profiles_phone_unique_idx
  on profiles (phone)
  where phone is not null and phone != '';

-- 3. Track whether a user has verified their phone via OTP.
alter table profiles
  add column if not exists phone_verified boolean not null default false;

-- 4. OTP table for phone verification (registration + login + password reset).
--    Rows auto-expire; the app deletes expired rows on each new OTP request.
create table if not exists phone_otps (
  id          text primary key,
  phone       text not null,
  code        text not null,
  purpose     text not null check (purpose in ('register', 'login', 'reset')),
  expires_at  timestamptz not null,
  attempts    integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists phone_otps_phone_idx on phone_otps (phone);
create index if not exists phone_otps_purpose_idx on phone_otps (purpose);
