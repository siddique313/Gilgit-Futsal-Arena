# Supabase migration and mock data

This folder contains SQL you can run in the **Supabase SQL Editor** to create tables that match your Nest/TypeORM entities and optionally seed mock data.

## Entities mapped

| Table         | Entity     | Key columns                                                                  |
| ------------- | ---------- | ---------------------------------------------------------------------------- |
| `users`       | User       | id, email, password, name                                                    |
| `tournaments` | Tournament | id, name, slug, sport, format, participantCount, userId                      |
| `teams`       | Team       | id, tournamentId, name, logoUrl, groupLabel                                  |
| `players`     | Player     | id, teamId, name, role, jerseyNumber                                         |
| `matches`     | Match      | id, tournamentId, homeTeamId, awayTeamId, scores, round, status, scheduledAt |
| `standings`   | Standing   | id, tournamentId, teamId, played, wins, goalsFor, goalsAgainst, points       |

## How to run in Supabase SQL Editor

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Go to **SQL Editor** → **New query**.
3. **First run the schema**  
   Copy the contents of `migrations/001_initial_schema.sql`, paste into the editor, then click **Run**.
4. **Then run the seed (optional)**  
   Copy the contents of `seed_mock_data.sql`, paste into the editor, then click **Run**.

You can also paste both files into one query and run once (schema first, then seed).

## Mock data summary

- **1 user**: `admin@futsal.local` (replace password hash if you use auth).
- **1 tournament**: "Spring Futsal Cup 2025", slug `spring-futsal-cup-2025`.
- **4 teams**: Alpha, Beta, Gamma, Delta (groups A and B).
- **6 players**: 2 per team for Alpha/Beta, 1 each for Gamma/Delta.
- **2 matches**: one finished (3–2), one scheduled.
- **4 standings** rows: one per team (points from the finished match).

To re-seed, you can truncate the tables (in dependency order) and run `seed_mock_data.sql` again, or change the seed script to use `ON CONFLICT ... DO UPDATE` where needed (standings already does this).

## Cloudinary images (from `server/.env.local`)

Seed data uses **Cloudinary** URLs keyed to `CLOUDINARY_CLOUD_NAME` in `server/.env.local` (e.g. `futsal`). All image URLs point to that cloud with a `seed/` folder and transforms (e.g. `c_fill,w_80,h_80` for team logos, `c_fill,g_face,w_96,h_96` for player avatars).

- **Tournament**: `seed/tournament-logo`
- **Teams**: `seed/team-alpha`, `seed/team-beta`, `seed/team-gamma`, `seed/team-delta`
- **Players**: `seed/player-alex`, `seed/player-jordan`, `seed/player-sam`, `seed/player-casey`, `seed/player-morgan`, `seed/player-riley`

To have images show up, upload assets to your Cloudinary account (Dashboard → Media Library) into a folder named `seed` with the public IDs above, or change the URLs in `seed_mock_data.sql` to match your existing public IDs.
