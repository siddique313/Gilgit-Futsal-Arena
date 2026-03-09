# Architecture

- **Web (Next.js):** App Router, dashboard, tournament/[slug], stadium (Three.js). Auth via NextAuth (credentials → NestJS JWT).
- **Server (NestJS):** REST API, Swagger, TypeORM (Supabase Postgres), JWT auth, Cloudinary for uploads.
- **Shared:** TypeScript types for tournament, team, match.

Reference: [Score7](https://www.score7.io/) — brackets, schedules, live results.
