# API

- **Base URL:** `http://localhost:5000`
- **Swagger:** `http://localhost:5000/api`

## Auth

- `POST /auth/register` — body: `{ email, password, name? }`
- `POST /auth/login` — body: `{ email, password }` → `{ user, access_token }`

## Tournaments

- `GET /tournaments` — list
- `GET /tournaments/slug/:slug` — by slug
- `GET /tournaments/:id/teams`
- `GET /tournaments/:id/matches`
- `GET /tournaments/:id/standings`
- `GET /tournaments/:id/bracket`
- `GET /tournaments/:id/stats`

## Users

- `GET /users/me` — requires `Authorization: Bearer <token>`
