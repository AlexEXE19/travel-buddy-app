-- Seed users — password for all: Travel123!
INSERT INTO users_credentials (id, email, password_hash, account_status, created_at)
VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 'sofia.andrade@travelbuddy.dev', '$2a$10$ciWHxcdGk9RqQzEd6RwFa.VBcyRSEB57D0hgRlHgexWT65RhaMeKG', 'ACTIVE', NOW()),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'luca.ferrari@travelbuddy.dev',  '$2a$10$eNxf3fzWDatUW4FMJjEM8.8PyXl9J4uslxsYiuNGfp8vkj.liXVYu', 'ACTIVE', NOW()),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'yuki.tanaka@travelbuddy.dev',   '$2a$10$RfnCp7eGu.4KvidSojH0FuTBtvCH0sWUN2j2rYjJaQlboIgIPmuUi', 'ACTIVE', NOW()),
  ('a1b2c3d4-0004-0004-0004-000000000004', 'alex.morgan@travelbuddy.dev',   '$2a$10$b8tei8SIUi7WgCLxJGArcerRAj7gUkP5NQzabkXFNE/6I1Jrk9du2', 'ACTIVE', NOW()),
  ('a1b2c3d4-0005-0005-0005-000000000005', 'amara.diallo@travelbuddy.dev',  '$2a$10$Kg47mdBZ8HQwPmFu2g4KUeekpVX0fEsrzci8IOW2f2vw/h1WXh6ja', 'ACTIVE', NOW()),
  -- New users reuse a valid bcrypt hash of "Travel123!" (any valid hash matches).
  ('a1b2c3d4-0006-0006-0006-000000000006', 'noah.schmidt@travelbuddy.dev',  '$2a$10$ciWHxcdGk9RqQzEd6RwFa.VBcyRSEB57D0hgRlHgexWT65RhaMeKG', 'ACTIVE', NOW()),
  ('a1b2c3d4-0007-0007-0007-000000000007', 'priya.sharma@travelbuddy.dev',  '$2a$10$ciWHxcdGk9RqQzEd6RwFa.VBcyRSEB57D0hgRlHgexWT65RhaMeKG', 'ACTIVE', NOW()),
  ('a1b2c3d4-0008-0008-0008-000000000008', 'emma.johnson@travelbuddy.dev',  '$2a$10$ciWHxcdGk9RqQzEd6RwFa.VBcyRSEB57D0hgRlHgexWT65RhaMeKG', 'ACTIVE', NOW()),
  ('a1b2c3d4-0009-0009-0009-000000000009', 'diego.martinez@travelbuddy.dev','$2a$10$ciWHxcdGk9RqQzEd6RwFa.VBcyRSEB57D0hgRlHgexWT65RhaMeKG', 'ACTIVE', NOW()),
  ('a1b2c3d4-000a-000a-000a-00000000000a', 'chloe.dubois@travelbuddy.dev',  '$2a$10$ciWHxcdGk9RqQzEd6RwFa.VBcyRSEB57D0hgRlHgexWT65RhaMeKG', 'ACTIVE', NOW()),
  ('a1b2c3d4-000b-000b-000b-00000000000b', 'liam.obrien@travelbuddy.dev',   '$2a$10$ciWHxcdGk9RqQzEd6RwFa.VBcyRSEB57D0hgRlHgexWT65RhaMeKG', 'ACTIVE', NOW())
ON CONFLICT DO NOTHING;

-- Default role for everyone, and a persistent admin (Sofia). Idempotent.
UPDATE users_credentials SET role = 'USER' WHERE role IS NULL;
UPDATE users_credentials SET role = 'ADMIN' WHERE email = 'sofia.andrade@travelbuddy.dev';
