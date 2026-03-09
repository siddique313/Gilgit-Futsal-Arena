-- ============================================================
-- Supabase migration: schema matching your TypeORM entities
-- Run this in Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- UUID generation (PostgreSQL 13+ has gen_random_uuid() built-in)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- USERS (entity: users)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL,
  name VARCHAR NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- TOURNAMENTS (entity: tournaments)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  sport VARCHAR NOT NULL DEFAULT 'futsal',
  description TEXT NULL,
  "logoUrl" VARCHAR NULL,
  format VARCHAR NOT NULL DEFAULT 'single_elimination',
  "participantCount" INT NOT NULL DEFAULT 8,
  "userId" UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- TEAMS (entity: teams)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tournamentId" UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  "logoUrl" VARCHAR NULL,
  "groupLabel" VARCHAR NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teams_tournament ON public.teams("tournamentId");

-- ------------------------------------------------------------
-- PLAYERS (entity: players)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "teamId" UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  "avatarUrl" VARCHAR NULL,
  role VARCHAR NULL,
  "jerseyNumber" INT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_players_team ON public.players("teamId");

-- ------------------------------------------------------------
-- MATCHES (entity: matches)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tournamentId" UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  "homeTeamId" UUID NULL REFERENCES public.teams(id) ON DELETE SET NULL,
  "awayTeamId" UUID NULL REFERENCES public.teams(id) ON DELETE SET NULL,
  "homePlaceholder" VARCHAR NULL,
  "awayPlaceholder" VARCHAR NULL,
  "homeScore" INT NULL,
  "awayScore" INT NULL,
  round INT NULL,
  "roundLabel" VARCHAR NULL,
  status VARCHAR NOT NULL DEFAULT 'scheduled',
  "scheduledAt" TIMESTAMPTZ NULL,
  venue VARCHAR NULL,
  referee VARCHAR NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_matches_tournament ON public.matches("tournamentId");
CREATE INDEX IF NOT EXISTS idx_matches_home_away ON public.matches("homeTeamId", "awayTeamId");

-- ------------------------------------------------------------
-- STANDINGS (entity: standings)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.standings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tournamentId" UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  "teamId" UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  played INT NOT NULL DEFAULT 0,
  wins INT NOT NULL DEFAULT 0,
  draws INT NOT NULL DEFAULT 0,
  losses INT NOT NULL DEFAULT 0,
  "goalsFor" INT NOT NULL DEFAULT 0,
  "goalsAgainst" INT NOT NULL DEFAULT 0,
  points INT NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE("tournamentId", "teamId")
);

CREATE INDEX IF NOT EXISTS idx_standings_tournament ON public.standings("tournamentId");
CREATE INDEX IF NOT EXISTS idx_standings_team ON public.standings("teamId");

-- Optional: enable RLS (Row Level Security) and policies if you use Supabase Auth
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
-- (add policies as needed)
