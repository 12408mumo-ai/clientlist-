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

Set `VITE_API_BASE_URL` to sync with a real backend. Without it, a localStorage adapter implements the identical contract so the standalone app keeps working — saves and fetches round-trip `added_by` either way.

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
