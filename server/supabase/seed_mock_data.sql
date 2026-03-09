-- ============================================================
-- Mock / seed data aligned to your entities
-- Run AFTER 001_initial_schema.sql in Supabase SQL Editor
-- Uses fixed UUIDs so references stay valid.
-- Cloudinary URLs use CLOUDINARY_CLOUD_NAME from .env.local (futsal).
-- Upload images to your Cloudinary "seed" folder or replace public_id.
-- Base: https://res.cloudinary.com/futsal/image/upload/
-- ============================================================

-- Clear existing seed (optional; remove if you want to keep existing data)
-- TRUNCATE public.standings, public.matches, public.players, public.teams, public.tournaments, public.users RESTART IDENTITY CASCADE;

-- Fixed UUIDs for relationships
-- User
INSERT INTO public.users (id, email, password, name, "createdAt", "updatedAt")
VALUES (
  'a0000001-0001-4000-8000-000000000001',
  'admin@futsal.local',
  '$2a$10$YourHashedPasswordHere',  -- replace with real hash if using auth
  'Admin User',
  now(),
  now()
)
ON CONFLICT (email) DO NOTHING;

-- Tournament (entity: id, name, slug, sport, description, logoUrl, format, participantCount, userId, createdAt, updatedAt)
-- logoUrl: Cloudinary (cloud name futsal from .env.local)
INSERT INTO public.tournaments (id, name, slug, sport, description, "logoUrl", format, "participantCount", "userId", "createdAt", "updatedAt")
VALUES (
  'b0000001-0001-4000-8000-000000000001',
  'Spring Futsal Cup 2025',
  'spring-futsal-cup-2025',
  'futsal',
  'Annual spring futsal tournament.',
  'https://res.cloudinary.com/futsal/image/upload/c_fill,w_120,h_120/seed/tournament-logo',
  'single_elimination',
  8,
  'a0000001-0001-4000-8000-000000000001',
  now(),
  now()
)
ON CONFLICT (slug) DO NOTHING;

-- Teams (entity: id, tournamentId, name, logoUrl, groupLabel, createdAt, updatedAt)
-- logoUrl: Cloudinary (futsal from .env.local) – upload team logos to seed/ folder
INSERT INTO public.teams (id, "tournamentId", name, "logoUrl", "groupLabel", "createdAt", "updatedAt")
VALUES
  ('c0000001-0001-4000-8000-000000000001', 'b0000001-0001-4000-8000-000000000001', 'Team Alpha', 'https://res.cloudinary.com/futsal/image/upload/c_fill,w_80,h_80/seed/team-alpha', 'A', now(), now()),
  ('c0000002-0001-4000-8000-000000000002', 'b0000001-0001-4000-8000-000000000001', 'Team Beta', 'https://res.cloudinary.com/futsal/image/upload/c_fill,w_80,h_80/seed/team-beta', 'A', now(), now()),
  ('c0000003-0001-4000-8000-000000000003', 'b0000001-0001-4000-8000-000000000001', 'Team Gamma', 'https://res.cloudinary.com/futsal/image/upload/c_fill,w_80,h_80/seed/team-gamma', 'B', now(), now()),
  ('c0000004-0001-4000-8000-000000000004', 'b0000001-0001-4000-8000-000000000001', 'Team Delta', 'https://res.cloudinary.com/futsal/image/upload/c_fill,w_80,h_80/seed/team-delta', 'B', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Players (entity: id, teamId, name, avatarUrl, role, jerseyNumber, createdAt, updatedAt)
-- avatarUrl: Cloudinary (futsal) – upload avatars to seed/ folder
INSERT INTO public.players (id, "teamId", name, "avatarUrl", role, "jerseyNumber", "createdAt", "updatedAt")
VALUES
  ('d0000001-0001-4000-8000-000000000001', 'c0000001-0001-4000-8000-000000000001', 'Alex Smith', 'https://res.cloudinary.com/futsal/image/upload/c_fill,g_face,w_96,h_96/seed/player-alex', 'forward', 7, now(), now()),
  ('d0000002-0001-4000-8000-000000000002', 'c0000001-0001-4000-8000-000000000001', 'Jordan Lee', 'https://res.cloudinary.com/futsal/image/upload/c_fill,g_face,w_96,h_96/seed/player-jordan', 'goalkeeper', 1, now(), now()),
  ('d0000003-0001-4000-8000-000000000003', 'c0000002-0001-4000-8000-000000000002', 'Sam Wilson', 'https://res.cloudinary.com/futsal/image/upload/c_fill,g_face,w_96,h_96/seed/player-sam', 'midfielder', 10, now(), now()),
  ('d0000004-0001-4000-8000-000000000004', 'c0000002-0001-4000-8000-000000000002', 'Casey Brown', 'https://res.cloudinary.com/futsal/image/upload/c_fill,g_face,w_96,h_96/seed/player-casey', 'defender', 5, now(), now()),
  ('d0000005-0001-4000-8000-000000000005', 'c0000003-0001-4000-8000-000000000003', 'Morgan Taylor', 'https://res.cloudinary.com/futsal/image/upload/c_fill,g_face,w_96,h_96/seed/player-morgan', 'forward', 9, now(), now()),
  ('d0000006-0001-4000-8000-000000000006', 'c0000004-0001-4000-8000-000000000004', 'Riley Davis', 'https://res.cloudinary.com/futsal/image/upload/c_fill,g_face,w_96,h_96/seed/player-riley', 'goalkeeper', 1, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Matches (entity: id, tournamentId, homeTeamId, awayTeamId, homePlaceholder, awayPlaceholder, homeScore, awayScore, round, roundLabel, status, scheduledAt, venue, referee, createdAt, updatedAt)
INSERT INTO public.matches (id, "tournamentId", "homeTeamId", "awayTeamId", "homePlaceholder", "awayPlaceholder", "homeScore", "awayScore", round, "roundLabel", status, "scheduledAt", venue, referee, "createdAt", "updatedAt")
VALUES
  ('e0000001-0001-4000-8000-000000000001', 'b0000001-0001-4000-8000-000000000001', 'c0000001-0001-4000-8000-000000000001', 'c0000002-0001-4000-8000-000000000002', NULL, NULL, 3, 2, 1, 'Semi-final 1', 'finished', now() - interval '1 day', 'Main Arena', 'Ref One', now(), now()),
  ('e0000002-0001-4000-8000-000000000002', 'b0000001-0001-4000-8000-000000000001', 'c0000003-0001-4000-8000-000000000003', 'c0000004-0001-4000-8000-000000000004', NULL, NULL, NULL, NULL, 1, 'Semi-final 2', 'scheduled', now() + interval '1 day', 'Court B', NULL, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Standings (entity: id, tournamentId, teamId, played, wins, draws, losses, goalsFor, goalsAgainst, points, createdAt, updatedAt)
INSERT INTO public.standings (id, "tournamentId", "teamId", played, wins, draws, losses, "goalsFor", "goalsAgainst", points, "createdAt", "updatedAt")
VALUES
  ('f0000001-0001-4000-8000-000000000001', 'b0000001-0001-4000-8000-000000000001', 'c0000001-0001-4000-8000-000000000001', 1, 1, 0, 0, 3, 2, 3, now(), now()),
  ('f0000002-0001-4000-8000-000000000002', 'b0000001-0001-4000-8000-000000000001', 'c0000002-0001-4000-8000-000000000002', 1, 0, 0, 1, 2, 3, 0, now(), now()),
  ('f0000003-0001-4000-8000-000000000003', 'b0000001-0001-4000-8000-000000000001', 'c0000003-0001-4000-8000-000000000003', 0, 0, 0, 0, 0, 0, 0, now(), now()),
  ('f0000004-0001-4000-8000-000000000004', 'b0000001-0001-4000-8000-000000000001', 'c0000004-0001-4000-8000-000000000004', 0, 0, 0, 0, 0, 0, 0, now(), now())
ON CONFLICT ("tournamentId", "teamId") DO UPDATE SET
  played = EXCLUDED.played,
  wins = EXCLUDED.wins,
  draws = EXCLUDED.draws,
  losses = EXCLUDED.losses,
  "goalsFor" = EXCLUDED."goalsFor",
  "goalsAgainst" = EXCLUDED."goalsAgainst",
  points = EXCLUDED.points,
  "updatedAt" = now();
