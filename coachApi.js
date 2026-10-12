/**
 * 4CRAZZ Coach API — data layer for career-coach records.
 *
 * Database / REST schema (snake_case) always includes `added_by`: the team
 * member who added the coach. Allowed values are listed in TEAM_MEMBERS.
 *
 * Endpoints implemented by a real backend:
 *   POST /api/coaches        create a coach        body: toCoachApiPayload(coach)
 *   PUT  /api/coaches/:id    update a coach        body: toCoachApiPayload(coach)
 *   GET  /api/coaches        list coaches          rows: schema incl. added_by
 *
 * Set VITE_API_BASE_URL to point the app at that backend. Without it, a
 * localStorage adapter implements the exact same contract (create / update /
 * fetch all round-trip `added_by`) so the standalone app keeps working.
 */

export const TEAM_MEMBERS = Object.freeze(['Dan', 'Robi', 'Menza', 'Obora']);

export const COACH_STORAGE_KEY = '4crazz-coach-network-v1';
export const LEGACY_COACH_STORAGE_KEY = 'northstar-coach-network-v1';

const API_BASE = String(import.meta.env?.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '');
export const isCoachApiRemote = API_BASE.length > 0;

export const coachApiRoutes = {
  list: `${API_BASE}/api/coaches`,
  create: `${API_BASE}/api/coaches`,
  update: (id) => `${API_BASE}/api/coaches/${encodeURIComponent(id)}`,
};

/** Return the team member name when it is one of the allowed values, else ''. */
export function normalizeTeamMember(value) {
  const name = String(value ?? '').trim();
  return TEAM_MEMBERS.includes(name) ? name : '';
}

/**
 * Map internal coach state to the database / REST schema payload used by
 * POST /api/coaches and PUT /api/coaches/:id.
 */
export function toCoachApiPayload(coach = {}) {
  return {
    id: String(coach.id ?? ''),
    full_name: String(coach.fullName ?? ''),
    title: String(coach.title ?? ''),
    bio: String(coach.bio ?? ''),
    avatar_url: String(coach.avatarUrl ?? ''),
    avatar_color: String(coach.avatarColor ?? 'gold'),
    location: String(coach.location ?? ''),
    remote: Boolean(coach.remote),
    email: String(coach.email ?? ''),
    years_experience: coach.yearsExperience ?? null,
    skills: Array.isArray(coach.skills) ? coach.skills.filter((skill) => typeof skill === 'string') : [],
    status: String(coach.status ?? 'new'),
    linkedin: String(coach.linkedin ?? ''),
    twitter: String(coach.twitter ?? ''),
    instagram: String(coach.instagram ?? ''),
    youtube: String(coach.youtube ?? ''),
    website: String(coach.website ?? ''),
    added_by: normalizeTeamMember(coach.added_by),
  };
}

/**
 * Map a database / REST row back to coach state. Tolerates legacy local
 * records that used camelCase field names. Always resolves `added_by`.
 */
export function fromCoachApiRecord(record = {}) {
  const pick = (snake, camel) => (record[snake] !== undefined ? record[snake] : record[camel]);
  return {
    id: String(record.id ?? ''),
    fullName: String(pick('full_name', 'fullName') ?? ''),
    title: String(pick('title', 'title') ?? ''),
    bio: String(pick('bio', 'bio') ?? ''),
    avatarUrl: String(pick('avatar_url', 'avatarUrl') ?? ''),
    avatarColor: String(pick('avatar_color', 'avatarColor') ?? 'gold'),
    location: String(pick('location', 'location') ?? ''),
    remote: Boolean(pick('remote', 'remote')),
    email: String(pick('email', 'email') ?? ''),
    yearsExperience: pick('years_experience', 'yearsExperience') ?? null,
    skills: Array.isArray(pick('skills', 'skills'))
      ? pick('skills', 'skills').filter((skill) => typeof skill === 'string')
      : [],
    status: String(pick('status', 'status') ?? 'new'),
    linkedin: String(pick('linkedin', 'linkedin') ?? ''),
    twitter: String(pick('twitter', 'twitter') ?? ''),
    instagram: String(pick('instagram', 'instagram') ?? ''),
    youtube: String(pick('youtube', 'youtube') ?? ''),
    website: String(pick('website', 'website') ?? ''),
    added_by: normalizeTeamMember(record.added_by),
  };
}

/* ------------------------------------------------------------------ */
/* Remote REST client                                                  */
/* ------------------------------------------------------------------ */

async function remoteRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers ?? {}),
    },
  });
  if (!response.ok) {
    let detail = '';
    try {
      detail = await response.text();
    } catch {
      /* ignore body read failures */
    }
    throw new Error(`Coach API ${options.method ?? 'GET'} ${url} failed (${response.status})${detail ? ` — ${detail.slice(0, 200)}` : ''}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

/* ------------------------------------------------------------------ */
/* Local storage adapter (same contract as /api/coaches)               */
/* ------------------------------------------------------------------ */

function localStore() {
  const store = globalThis.localStorage;
  if (!store) throw new Error('localStorage is not available; cannot use the local coach API adapter.');
  return store;
}

function readLocalRows() {
  const store = localStore();
  const raw = store.getItem(COACH_STORAGE_KEY) ?? store.getItem(LEGACY_COACH_STORAGE_KEY);
  if (raw === null) return [];
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

function writeLocalRows(rows) {
  localStore().setItem(COACH_STORAGE_KEY, JSON.stringify(rows));
}

/** Read every stored coach as coach state (incl. `added_by`). */
export function readStoredCoaches() {
  return readLocalRows().map(fromCoachApiRecord);
}

/** Persist coach state using the database / REST schema (incl. `added_by`). */
export function writeStoredCoaches(coaches) {
  writeLocalRows(coaches.map(toCoachApiPayload));
}

/* ------------------------------------------------------------------ */
/* Public API — create / update / fetch coaches                        */
/* ------------------------------------------------------------------ */

/**
 * POST /api/coaches — create a coach and return the saved record
 * (including `added_by`). Falls back to the local adapter when no backend
 * is configured or the request fails.
 */
export async function createCoach(coach) {
  const payload = toCoachApiPayload(coach);
  if (isCoachApiRemote) {
    try {
      const row = await remoteRequest(coachApiRoutes.create, { method: 'POST', body: JSON.stringify(payload) });
      return fromCoachApiRecord(row ?? payload);
    } catch (error) {
      console.warn('[Coach API] POST /api/coaches failed; saving locally instead.', error);
    }
  }
  const rows = readLocalRows().filter((row) => String(row?.id) !== payload.id);
  rows.unshift(payload);
  writeLocalRows(rows);
  return fromCoachApiRecord(payload);
}

/**
 * PUT /api/coaches/:id — update a coach and return the saved record
 * (including `added_by`). Falls back to the local adapter when no backend
 * is configured or the request fails.
 */
export async function updateCoach(coach) {
  const payload = toCoachApiPayload(coach);
  if (isCoachApiRemote) {
    try {
      const row = await remoteRequest(coachApiRoutes.update(payload.id), { method: 'PUT', body: JSON.stringify(payload) });
      return fromCoachApiRecord(row ?? payload);
    } catch (error) {
      console.warn('[Coach API] PUT /api/coaches/:id failed; saving locally instead.', error);
    }
  }
  const rows = readLocalRows();
  const index = rows.findIndex((row) => String(row?.id) === payload.id);
  if (index >= 0) rows[index] = payload;
  else rows.unshift(payload);
  writeLocalRows(rows);
  return fromCoachApiRecord(payload);
}

/**
 * GET /api/coaches — fetch all coaches (including `added_by`) as coach state.
 */
export async function fetchCoaches() {
  if (isCoachApiRemote) {
    const rows = await remoteRequest(coachApiRoutes.list, { method: 'GET' });
    return (Array.isArray(rows) ? rows : []).map(fromCoachApiRecord);
  }
  return readStoredCoaches();
}
