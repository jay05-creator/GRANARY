-- Granary app schema: profiles, facilities, lots, storage requests, encrypted documents.
-- Scoped by user_id (TEXT) for auth isolation. Passwords live in Better Auth "account".

create table if not exists profiles (
  user_id text primary key,
  role text not null check (role in ('farmer', 'operator')),
  name text not null,
  phone text,
  email text,
  village_or_company text,
  farm_or_contact text,
  district text default 'Nashik',
  crops text[] default '{}',
  lat double precision default 20.08,
  lng double precision default 74.11,
  photo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists facilities (
  id text primary key,
  operator_user_id text not null references profiles(user_id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('cold', 'dry', 'packhouse')),
  lat double precision not null,
  lng double precision not null,
  address text not null,
  city text not null,
  capacity_tons double precision not null check (capacity_tons > 0),
  base_occupied_tons double precision not null default 0,
  rate_per_ton_day double precision not null check (rate_per_ton_day >= 0),
  temp_range text,
  crops text[] default '{}',
  photo text,
  hours text default '6:00 – 20:00',
  created_at timestamptz not null default now()
);

create index if not exists facilities_operator_idx on facilities (operator_user_id);
create index if not exists facilities_city_idx on facilities (city);

create table if not exists lots (
  id text primary key,
  facility_id text not null references facilities(id) on delete cascade,
  farmer_user_id text not null references profiles(user_id) on delete cascade,
  crop text not null,
  variety text not null default 'Standard',
  tons double precision not null check (tons > 0),
  stored_at date not null,
  until_date date not null,
  status text not null check (status in ('stored', 'inbound', 'released')) default 'inbound',
  created_at timestamptz not null default now()
);

create index if not exists lots_facility_idx on lots (facility_id);
create index if not exists lots_farmer_idx on lots (farmer_user_id);

create table if not exists farmer_requests (
  id text primary key,
  farmer_user_id text not null references profiles(user_id) on delete cascade,
  farmer_name text not null,
  farmer_village text,
  farmer_contact text,
  crop text not null,
  variety text not null default 'Standard',
  tons double precision not null check (tons > 0),
  days integer not null check (days > 0),
  lat double precision,
  lng double precision,
  requested_at date not null default current_date,
  status text not null check (status in ('pending', 'approved', 'denied')) default 'pending',
  allocated_facility_id text references facilities(id) on delete set null,
  allocated_facility_name text,
  operator_user_id text,
  operator_name text,
  operator_contact text,
  notified_farmer boolean not null default false,
  ai_advisory text,
  created_at timestamptz not null default now()
);

create index if not exists farmer_requests_status_idx on farmer_requests (status);
create index if not exists farmer_requests_farmer_idx on farmer_requests (farmer_user_id);

-- Encrypted sensitive documents (warehouse certs, WDRA, capacity proofs).
-- ciphertext is AES-256-GCM: base64(iv || authTag || encrypted)
create table if not exists documents (
  id text primary key,
  owner_user_id text not null references profiles(user_id) on delete cascade,
  doc_type text not null check (doc_type in ('warehouse', 'capacity', 'wdra', 'other')),
  filename text not null,
  mime_type text not null default 'application/octet-stream',
  ciphertext text not null,
  size_bytes integer not null,
  created_at timestamptz not null default now()
);

create index if not exists documents_owner_idx on documents (owner_user_id);
