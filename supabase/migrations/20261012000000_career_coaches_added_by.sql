-- 4CRAZZ Coach Management — cross-device sync schema
-- Creates the shared `career_coaches` table and the `added_by` column.
-- Idempotent: safe to run multiple times in the Supabase SQL editor.

-- 1) Core table (coach records were previously device-local only)
CREATE TABLE IF NOT EXISTS career_coaches (
  id text PRIMARY KEY,
  full_name text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  avatar_url text NOT NULL DEFAULT '',
  avatar_color text NOT NULL DEFAULT 'gold',
  location text NOT NULL DEFAULT '',
  remote boolean NOT NULL DEFAULT false,
  email text NOT NULL DEFAULT '',
  years_experience integer,
  skills jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'new',
  linkedin text NOT NULL DEFAULT '',
  twitter text NOT NULL DEFAULT '',
  instagram text NOT NULL DEFAULT '',
  youtube text NOT NULL DEFAULT '',
  website text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2) Required column: who added the coach ('Dan' | 'Robi' | 'Menza' | 'Obora')
ALTER TABLE career_coaches ADD COLUMN IF NOT EXISTS added_by TEXT;

-- Optional backfill so existing rows never render blank
UPDATE career_coaches SET added_by = 'Unknown' WHERE added_by IS NULL;

-- 3) Row Level Security: only signed-in founder/team members
--    (the app authenticates with Supabase Auth; the anon key + user JWT is
--    attached automatically by supabase-js)
ALTER TABLE career_coaches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "team can read career_coaches" ON career_coaches;
CREATE POLICY "team can read career_coaches"
  ON career_coaches FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "team can insert career_coaches" ON career_coaches;
CREATE POLICY "team can insert career_coaches"
  ON career_coaches FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "team can update career_coaches" ON career_coaches;
CREATE POLICY "team can update career_coaches"
  ON career_coaches FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "team can delete career_coaches" ON career_coaches;
CREATE POLICY "team can delete career_coaches"
  ON career_coaches FOR DELETE TO authenticated USING (true);
