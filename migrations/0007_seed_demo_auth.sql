-- 0007_seed_demo_auth.sql
-- Seed core demo users into Better Auth identity tables for fresh database initializations.

-- Meera Kulkarni (farmer-meera, +91 98220 99887, pass: meerakulkarni123)
insert into "user" ("id", "name", "email", "emailVerified", "createdAt", "updatedAt")
values (
  'farmer-meera',
  'Meera Kulkarni',
  '919822099887@granary.local',
  true,
  now(),
  now()
) on conflict ("id") do update set "email" = excluded."email", "emailVerified" = true;

insert into "account" ("id", "accountId", "providerId", "userId", "password", "createdAt", "updatedAt")
values (
  'account-farmer-meera',
  'farmer-meera',
  'credential',
  'farmer-meera',
  'acc4b7f0e780655bcc524e6b21c04be3:31e52481bc76a2564237c2db60c670cca4f91c11fb05bafd688277a75df14ea443822c905eaa336f39315038285e760f1691197505a5bb9a34cd91faea90bdbf',
  now(),
  now()
) on conflict ("id") do nothing;

-- Sahyadri Cold Chain (op-sahyadri, +91 98230 12345, pass: sahyadricoldchain123)
insert into "user" ("id", "name", "email", "emailVerified", "createdAt", "updatedAt")
values (
  'op-sahyadri',
  'Sahyadri Cold Chain',
  '919823012345@granary.local',
  true,
  now(),
  now()
) on conflict ("id") do update set "email" = excluded."email", "emailVerified" = true;

insert into "account" ("id", "accountId", "providerId", "userId", "password", "createdAt", "updatedAt")
values (
  'account-op-sahyadri',
  'op-sahyadri',
  'credential',
  'op-sahyadri',
  'c3e1e912a78e47fdbb1481ac96b17c9b:262f792e35a96860ce398a69d123a67040d860d5b5aa771dcbf68a2bf6d917fbfd0f36cb077d24ff9bf656a89cbbff4f8846c2688b13ffc3d3bc0a69a08e1b6f',
  now(),
  now()
) on conflict ("id") do nothing;
