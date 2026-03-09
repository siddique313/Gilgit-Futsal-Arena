# Futsal Game GB — Web

Next.js frontend for the futsal tournament platform. Brackets, schedules, live results, and a 3D stadium view. Inspired by [Score7](https://www.score7.io/).

---

## Stack

| Technology                              | Purpose                                                    |
| --------------------------------------- | ---------------------------------------------------------- |
| **Next.js 14**                          | App Router, server/client components, API routes           |
| **Tailwind CSS**                        | Utility-first styling                                      |
| **Shadcn UI** (Radix)                   | Accessible components (Button, Dialog, Tabs, etc.)         |
| **Three.js** (@react-three/fiber, drei) | 3D stadium scene                                           |
| **Cloudinary**                          | Image uploads (logos, avatars) via upload preset           |
| **NextAuth**                            | Auth (credentials → NestJS JWT); Passport-style strategies |
| **Supabase**                            | Optional client for realtime or direct access              |
| **SWR**                                 | Data fetching and cache (hooks)                            |

---

## Requirements

- Node.js 18+
- Running API at `NEXT_PUBLIC_API_URL` (default `http://localhost:5000`)

---

## Quick start

```bash
# From repo root
cd web
npm install
cp .env.example .env.local
# Edit .env.local with your values, then:
npm run dev
```

Open **http://localhost:3000**.

---

## Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start Next.js dev server (port 3000) |
| `npm run build` | Production build                     |
| `npm run start` | Run production server                |
| `npm run lint`  | Run ESLint                           |

---

## Environment (.env.local)

Copy from `.env.example`. Required and optional variables:

| Variable                               | Required                 | Description                                        |
| -------------------------------------- | ------------------------ | -------------------------------------------------- |
| `NEXT_PUBLIC_APP_NAME`                 | Yes                      | App name (e.g. `futsal-game-gb`)                   |
| `NEXT_PUBLIC_APP_URL`                  | Yes                      | App URL (e.g. `http://localhost:3000`)             |
| `NEXT_PUBLIC_SUPABASE_URL`             | If using Supabase client | Supabase project URL                               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`        | If using Supabase client | Supabase anon key                                  |
| `NEXT_PUBLIC_API_URL`                  | Yes                      | NestJS API base URL (e.g. `http://localhost:5000`) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`    | If using uploads         | Cloudinary cloud name                              |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | If using uploads         | Unsigned upload preset                             |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY`       | Optional                 | For client-side usage                              |
| `NEXTAUTH_SECRET`                      | Yes (for auth)           | Secret for NextAuth (e.g. random string)           |
| `NEXTAUTH_URL`                         | Yes (for auth)           | Same as `NEXT_PUBLIC_APP_URL`                      |

---

## Project structure

```
web/
├── app/
│   ├── (auth)/              # Auth layout
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── api/
│   │   └── auth/[...nextauth]/   # NextAuth API route
│   ├── dashboard/           # Dashboard layout + pages
│   │   ├── tournaments/     # List + create
│   │   ├── teams/
│   │   ├── matches/
│   │   └── page.tsx
│   ├── tournament/[slug]/   # Tournament-scoped pages
│   │   ├── teams/
│   │   ├── matches/         # Groups matches
│   │   ├── standings/       # Groups standings
│   │   ├── bracket/         # Knockout matches
│   │   ├── stats/
│   │   └── page.tsx         # Overview
│   ├── stadium/             # Three.js stadium
│   ├── find/                # Find tournaments
│   ├── pricing/
│   ├── layout.tsx
│   └── page.tsx             # Landing
├── components/
│   ├── ui/                  # Shadcn-style (Button, etc.)
│   ├── layout/              # Navbar, Sidebar, Footer
│   ├── tournament/          # TournamentCard, BracketView, StandingsTable, MatchCard
│   ├── team/                # TeamCard, PlayerList
│   ├── three/               # StadiumScene, Field, PlayerModel
│   ├── providers.tsx        # Session + Theme
│   └── theme-provider.tsx
├── lib/
│   ├── api.ts               # API client + tournament helpers
│   ├── supabase.ts          # Supabase client (browser)
│   ├── cloudinary.ts        # Upload URL, image URL helpers
│   └── utils.ts             # cn(), etc.
├── hooks/
│   ├── useAuth.ts           # NextAuth session
│   ├── useTournament.ts
│   └── useTeams.ts
├── services/
│   ├── auth.service.ts
│   ├── tournament.service.ts
│   ├── team.service.ts
│   └── match.service.ts
├── styles/
│   └── globals.css
├── public/
│   ├── images/
│   └── models/
├── middleware.ts            # Protects /dashboard, /tournament
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

---

## Main features

- **Landing:** Hero, Create / Find / Pricing, Log in.
- **Auth:** Login and Register (credentials → NestJS `/auth/login`, `/auth/register`).
- **Dashboard:** Overview, Tournaments (list + create), Teams, Matches.
- **Tournament (`/tournament/[slug]`):** Overview, Teams, Groups Matches, Groups Standings, Knockout (bracket), Stats.
- **Stadium:** `/stadium` — Three.js futsal field scene.
- **Find & Pricing:** Search placeholder and pricing copy.

Protected routes (`/dashboard/*`, `/tournament/*`) use NextAuth middleware; unauthenticated users are redirected to `/login`.

---

## API usage

The app calls the NestJS API at `NEXT_PUBLIC_API_URL`:

- `GET /tournaments` — list
- `GET /tournaments/slug/:slug` — by slug
- `POST /tournaments` — create
- `GET /tournaments/:id/teams` — teams
- `GET /tournaments/:id/matches` — matches
- `GET /tournaments/:id/standings` — standings
- `GET /tournaments/:id/bracket` — knockout bracket
- `GET /tournaments/:id/stats` — player stats
- `POST /auth/register`, `POST /auth/login` — auth

Use `lib/api.ts` and the services for consistent requests. Attach JWT from the NextAuth session when the API requires it.

---

## Theming

- CSS variables in `styles/globals.css` (e.g. `--primary`, `--background`).
- `next-themes` for light/dark; `ThemeProvider` in `components/providers.tsx`.
- Tailwind uses `hsl(var(--primary))` etc. for colors.

---

## Deployment

- Build: `npm run build`.
- Run: `npm run start` (or host on Vercel/Node).
- Set all `NEXT_PUBLIC_*` and `NEXTAUTH_*` in the deployment environment; point `NEXT_PUBLIC_API_URL` to the deployed server.

---

## Related

- **Server (NestJS):** See `../server/README.md` for API, Swagger, and env.
- **Monorepo:** From root, `npm run dev` can run both web and server (see root `package.json`).
