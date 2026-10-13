# 4CRAZZ Coach Management

A responsive founder workspace for managing a career-coach network with a split theme: a luxury black-and-gold navigation rail and login, paired with a warm cream dashboard workspace accented in metallic gold. Built with HTML, CSS, JavaScript, Vite, and Supabase Authentication.

## Environment Setup

Create a `.env.local` file in the project root with your Supabase credentials:

```bash
cp .env.example .env.local
```

Configure your variables in `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

- `VITE_SUPABASE_URL`: Your Supabase Project URL (found under **Project Settings > API** in your Supabase dashboard).
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Project public anon key.

## Run locally

```bash
npm install
npm run dev
```

Vite prints the local development URL. To make a production build:

```bash
npm run build
npm run preview
```

The production site is generated in `dist/`.

## Authentication

- **Real Supabase Auth**: Direct integration with `@supabase/supabase-js`.
- **Session Persistence**: Sessions are securely persisted in local storage and refreshed automatically via `getSession()` and `onAuthStateChange()`.
- **Sign Out Flow**: Both desktop sidebar and mobile header provide clean sign-out actions.
- **Error Feedback**: Immediate, styled error feedback for invalid credentials or configuration issues.

## Coach data & API payload

Every coach record carries an `added_by` field — the team member who added the coach (`Dan`, `Robi`, `Menza`, or `Obora`). It is required in the add / edit modal and rendered as an "Added by: …" badge on each coach card.

`coachApi.js` is the data layer. It maps internal coach state to the snake_case database / REST schema (`toCoachApiPayload` / `fromCoachApiRecord`) and implements:

| Action | Endpoint | Payload |
| --- | --- | --- |
| Create | `POST /api/coaches` | `toCoachApiPayload(coach)` incl. `added_by` |
| Update | `PUT /api/coaches/:id` | `toCoachApiPayload(coach)` incl. `added_by` |
| Fetch | `GET /api/coaches` | rows incl. `added_by` |

Backends are used in this order — **first available wins**:

1. **REST API** — set `VITE_API_BASE_URL`.
2. **Supabase `career_coaches` table** — set `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (already required for auth). This is the **cross-device sync** path: every laptop/phone reads and writes the same rows, so coaches (and their `added_by`) added on one device appear on all others. The app syncs on sign-in and whenever the window regains focus; device-local records missing from the shared table are pushed up automatically; deletes propagate too.
3. **localStorage adapter** — offline fallback with the identical contract.

### Supabase migration (run once)

Create the shared table and the `added_by` column by running the idempotent script in the Supabase SQL editor:

`supabase/migrations/20261012000000_career_coaches_added_by.sql`

```sql
ALTER TABLE career_coaches ADD COLUMN IF NOT EXISTS added_by TEXT;
```

The script also creates the `career_coaches` table if missing, backfills `added_by`, and enables Row Level Security policies for signed-in team members. Until it is run, the app keeps working per-device (local fallback) and logs a warning.

## Included Features

- Split color theme: black-and-gold sidebar & login, cream light dashboard with gold accents
- Coach directory with live search and status filters
- Coach status badges: **new** and **video sent** (with matching dashboard filters and summary counts)
- Create, edit, and delete coach profiles
- **"Added By" team-member tracking** — required dropdown (Dan, Robi, Menza, Obora) in the add / edit coach modal, stored as `added_by`, and shown as an "Added by: …" badge on every coach card
- Profile details, avatar URL or gold-tone preset, remote status, skills, coach status, and social / portfolio links
- Summary counts for coaches, new coaches, videos sent, and distinct specialties
- LocalStorage persistence with a sample directory on first load (legacy availability statuses migrate automatically)
- Responsive desktop, tablet, and mobile layouts
