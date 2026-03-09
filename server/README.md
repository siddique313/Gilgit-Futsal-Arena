# Futsal Game GB — Server

NestJS REST API for the futsal tournament platform. Auth, tournaments, teams, players, matches, standings, and uploads. Inspired by [Score7](https://www.score7.io/).

---

## Stack

| Technology                              | Purpose                                         |
| --------------------------------------- | ----------------------------------------------- |
| **NestJS 10**                           | Framework, modules, DI                          |
| **Swagger**                             | API docs at `/api`                              |
| **TypeORM**                             | ORM, entities, migrations                       |
| **Postgres (Supabase)**                 | Database (via connection string or DB\_\* vars) |
| **Cloudinary**                          | Image uploads (logos, avatars)                  |
| **Passport + JWT**                      | Auth (register, login, protected routes)        |
| **bcrypt**                              | Password hashing                                |
| **class-validator / class-transformer** | DTOs and validation                             |

---

## Requirements

- Node.js 18+
- Postgres (e.g. Supabase project with connection details)

---

## Quick start

```bash
# From repo root
cd server
npm install
cp .env.example .env
# Edit .env with Supabase/DB, JWT, Cloudinary, then:
npm run start:dev
```

- **API:** http://localhost:5000
- **Swagger:** http://localhost:5000/api

---

## Scripts

| Command              | Description                             |
| -------------------- | --------------------------------------- |
| `npm run build`      | Compile to `dist/`                      |
| `npm run start`      | Run (compiled)                          |
| `npm run start:dev`  | Run in watch mode                       |
| `npm run start:prod` | Run production build (`node dist/main`) |
| `npm run lint`       | Run ESLint                              |

---

## Environment (.env)

Copy from `.env.example`. Key variables:

| Variable                    | Required               | Description                                                                                                                                                    |
| --------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `APP_NAME`                  | No                     | App name (e.g. `futsal-game-gb`)                                                                                                                               |
| `PORT`                      | No                     | Server port (default `5000`)                                                                                                                                   |
| `NODE_ENV`                  | No                     | `development` / `production`                                                                                                                                   |
| `SUPABASE_URL`              | If using Supabase APIs | Supabase project URL                                                                                                                                           |
| `SUPABASE_ANON_KEY`         | If using Supabase APIs | Anon key                                                                                                                                                       |
| `SUPABASE_SERVICE_ROLE_KEY` | If using service role  | Service role key                                                                                                                                               |
| `DATABASE_URL`              | Yes (or DB\_\*)        | Postgres connection string                                                                                                                                     |
| `DB_HOST`                   | Yes (or DATABASE_URL)  | Postgres host                                                                                                                                                  |
| `DB_PORT`                   | No                     | Postgres port (default `5432`)                                                                                                                                 |
| `DB_USERNAME`               | Yes                    | Postgres user                                                                                                                                                  |
| `DB_PASSWORD`               | Yes                    | Postgres password                                                                                                                                              |
| `DB_NAME`                   | Yes                    | Postgres database name                                                                                                                                         |
| `TYPEORM_SYNCHRONIZE`       | No                     | `true` = auto-sync schema (dev only)                                                                                                                           |
| `TYPEORM_LOGGING`           | No                     | `true` = log SQL                                                                                                                                               |
| `CLOUDINARY_CLOUD_NAME`     | If using uploads       | Your cloud name from [Cloudinary Dashboard](https://console.cloudinary.com) → **Product environment credentials** (must match your account, not a placeholder) |
| `CLOUDINARY_API_KEY`        | If using uploads       | API key                                                                                                                                                        |
| `CLOUDINARY_API_SECRET`     | If using uploads       | API secret                                                                                                                                                     |
| `JWT_SECRET`                | Yes (for auth)         | Secret for signing JWTs                                                                                                                                        |
| `JWT_EXPIRES`               | No                     | Expiry (e.g. `7d`)                                                                                                                                             |

---

## Project structure

```
server/
├── src/
│   ├── main.ts                 # Bootstrap, CORS, Swagger, ValidationPipe
│   ├── app.module.ts           # Root module, TypeORM, feature modules
│   ├── modules/
│   │   ├── auth/               # Register, login, JWT
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   └── jwt-auth.guard.ts
│   │   ├── users/
│   │   │   ├── user.entity.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   ├── tournaments/
│   │   │   ├── tournament.entity.ts
│   │   │   ├── tournaments.controller.ts
│   │   │   ├── tournaments.service.ts
│   │   │   └── tournaments.module.ts
│   │   ├── teams/
│   │   │   ├── team.entity.ts
│   │   │   ├── teams.controller.ts
│   │   │   ├── teams.service.ts
│   │   │   └── teams.module.ts
│   │   ├── players/
│   │   │   ├── player.entity.ts
│   │   │   ├── players.controller.ts
│   │   │   ├── players.service.ts
│   │   │   └── players.module.ts
│   │   ├── matches/
│   │   │   ├── match.entity.ts
│   │   │   ├── matches.controller.ts
│   │   │   ├── matches.service.ts
│   │   │   └── matches.module.ts
│   │   ├── standings/
│   │   │   ├── standing.entity.ts
│   │   │   ├── standings.controller.ts
│   │   │   ├── standings.service.ts
│   │   │   └── standings.module.ts
│   │   └── uploads/
│   │       ├── upload.controller.ts
│   │       ├── upload.service.ts
│   │       └── upload.module.ts
│   ├── common/                 # Guards, decorators, filters (optional)
│   ├── database/              # typeorm.config (optional)
│   └── utils/                 # bracket.generator, standings.calculator, fixture.generator (optional)
├── test/
├── .env
├── .env.example
├── tsconfig.json
├── nest-cli.json
└── package.json
```

---

## API overview

Base URL: `http://localhost:5000`. Full docs: **http://localhost:5000/api** (Swagger).

### Auth

| Method | Path             | Description                                                              |
| ------ | ---------------- | ------------------------------------------------------------------------ |
| POST   | `/auth/register` | Register (body: `email`, `password`, `name?`) → `{ user, access_token }` |
| POST   | `/auth/login`    | Login (body: `email`, `password`) → `{ user, access_token }`             |

### Tournaments

| Method | Path                         | Description                                                     |
| ------ | ---------------------------- | --------------------------------------------------------------- |
| GET    | `/tournaments`               | List tournaments                                                |
| POST   | `/tournaments`               | Create (body: `name`, `sport?`, `format?`, `participantCount?`) |
| GET    | `/tournaments/slug/:slug`    | Get by slug                                                     |
| GET    | `/tournaments/:id/teams`     | Teams of a tournament                                           |
| GET    | `/tournaments/:id/matches`   | Matches                                                         |
| GET    | `/tournaments/:id/standings` | Standings                                                       |
| GET    | `/tournaments/:id/bracket`   | Knockout bracket                                                |
| GET    | `/tournaments/:id/stats`     | Player stats (goals, assists, cards, MVP)                       |

### Users

| Method | Path        | Description                                             |
| ------ | ----------- | ------------------------------------------------------- |
| GET    | `/users/me` | Current user (requires `Authorization: Bearer <token>`) |

### Uploads

| Method | Path             | Description                                                       |
| ------ | ---------------- | ----------------------------------------------------------------- |
| POST   | `/uploads/image` | Image upload (body or multipart; integrate Cloudinary in service) |

---

## Database

- TypeORM connects to Postgres using `DATABASE_URL` or `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`.
- With `TYPEORM_SYNCHRONIZE=true` (dev only), entities are synced to the database on startup.
- Entities: `User`, `Tournament`, `Team`, `Player`, `Match`, `Standing`. Add or extend in `src/modules/*/` and register in `AppModule`.

---

## Auth flow

1. **Register:** `POST /auth/register` → user created, JWT returned.
2. **Login:** `POST /auth/login` → JWT returned.
3. **Protected routes:** Send `Authorization: Bearer <access_token>`.
4. **Guard:** `JwtAuthGuard` + `JwtStrategy` validate token and attach user.

Frontend (Next.js) uses NextAuth with credentials provider that calls these endpoints and stores the JWT in the session.

---

## CORS

Configured in `main.ts` to allow the web app origin (e.g. `http://localhost:3000` from `NEXT_PUBLIC_APP_URL` or env). Adjust for production.

---

## Related

- **Web (Next.js):** See `../web/README.md` for frontend setup and env.
- **Shared types:** `../shared/types/` for tournament, team, match types.
- **Docs:** `../docs/api.md`, `../docs/architecture.md`.
