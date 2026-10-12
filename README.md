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

## Included Features

- Split color theme: black-and-gold sidebar & login, cream light dashboard with gold accents
- Coach directory with live search and status filters
- Coach status badges: **new** and **video sent** (with matching dashboard filters and summary counts)
- Create, edit, and delete coach profiles
- Profile details, avatar URL or gold-tone preset, remote status, skills, coach status, and social / portfolio links
- Summary counts for coaches, new coaches, videos sent, and distinct specialties
- LocalStorage persistence with a sample directory on first load (legacy availability statuses migrate automatically)
- Responsive desktop, tablet, and mobile layouts
