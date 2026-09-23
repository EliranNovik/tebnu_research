# Tebnu Questionnaire

Anonymous 5-question research survey plus a secure admin analytics dashboard.

The public questionnaire never writes to Supabase from the browser. The React app talks to a Node API, the API validates with Zod, and only then does the server write with the Supabase service role key.

## Architecture

```text
React (Vite)  →  Express API  →  Supabase Postgres
                     ↑
              Service role key
              + Auth token checks
```

Shared questionnaire config lives in `shared/` so the UI and the server stay on the same option keys, limits, and version (`1.0`).

### Tables

- `survey_responses` — one row per completed questionnaire
- `survey_events` — anonymous funnel events (`landing_view`, `survey_start`, `question_view`, `survey_complete`)
- `admins` — `{ id: auth user uuid, role: "admin", active: true }`

Row Level Security is enabled with no public policies. Only the server, using the service role key, can read or write.

Without Supabase credentials the API uses an in-memory store so the public survey and admin dashboard can be explored locally. Data resets when the server restarts. Add the keys below for durable storage.

## Local development

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
npm install
npm run dev
```

- Survey: http://localhost:5173
- Admin: http://localhost:5173/admin (or `/admin/login` once Supabase is configured)
- API: http://localhost:4000/api/health

If port 4000 is already in use, set `PORT` and `VITE_API_URL` in `server/.env` and `client/.env` to a free port.

### Supabase keys

Paste them here:

- `client/.env` — `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- `server/.env` — `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

Find them in Supabase under **Project Settings → API**.

### Supabase setup

1. Create a Supabase project and enable **Email** auth.
2. Run `supabase/schema.sql` in the SQL editor.
3. Create an admin user in Authentication.
4. Insert that user into `admins`:

```sql
insert into public.admins (id, role, active)
values ('USER_UUID', 'admin', true);
```

5. Paste the URL and anon key into `client/.env`.
6. Paste the URL and service role key into `server/.env`. Never put the service role key in the client.

## API

Public:

- `POST /api/survey`
- `POST /api/survey/events`

Admin (Bearer Supabase access token):

- `GET /api/admin/overview`
- `GET /api/admin/responses`
- `GET /api/admin/responses/:id`
- `GET /api/admin/analytics/categories`
- `GET /api/admin/analytics/current-method`
- `GET /api/admin/analytics/discovery`
- `GET /api/admin/analytics/trust`
- `GET /api/admin/analytics/barriers`
- `GET /api/admin/analytics/other`

Query params: `from`, `to`, `category`, `page`, `limit`.

Percentages are **respondents selecting an option / total respondents**, not share of all selections.

## Deploy

- Frontend: Vercel, `client/` as the root, `VITE_API_URL` pointing at the API.
- Backend: any Node host (Render, Railway, Fly). Set `CLIENT_ORIGIN` to the Vercel URL.

The public survey is mobile-first (320px+) and designed for WhatsApp / Instagram / Telegram traffic.
