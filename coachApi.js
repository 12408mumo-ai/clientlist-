/**
 * Career Calls Coach API — data layer for career-coach records.
 *
 * Database / REST schema (snake_case) always includes `added_by`: the team
 * member who added the coach. Allowed values are listed in TEAM_MEMBERS.
 *
 * Backends (first available wins):
 *   1. REST API     — VITE_API_BASE_URL set:
 *                      POST /api/coaches, PUT /api/coaches/:id, GET /api/coaches
 *   2. Supabase     — VITE_SUPABASE_URL/ANON_KEY set: shared `career_coaches`
 *                      table (see supabase/migrations/) so every device reads
 *                      and writes the same records — cross-device sync
 *   3. localStorage — offline fallback with the identical contract
 *
 * The `career_coaches` migration (incl. `added_by TEXT`) lives in
 * supabase/migrations/20261012000000_career_coaches_added_by.sql.
 */

import { supabase, isSupabaseConfigured } from './supabaseClient.js';

export const TEAM_MEMBERS = Object.freeze(['Dan', 'Robi', 'Menza', 'Obora']);

export const COACH_STORAGE_KEY = '4crazz-coach-network-v1';
export const LEGACY_COACH_STORAGE_KEY = 'northstar-coach-network-v1';
export const CAREER_COACHES_TABLE = 'career_coaches';

const API_BASE = String(import.meta.env?.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '');
export const isCoachApiRemote = API_BASE.length > 0;

export const coachApiRoutes = {
  list: `${API_BASE}/api/coaches`,
  create: `${API_BASE}/api/coaches`,
  update: (id) => `${API_BASE}/api/coaches/${encodeURIComponent(id)}`,
  remove: (id) => `${API_BASE}/api/coaches/${encodeURIComponent(id)}`,
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
/* Supabase adapter — shared `career_coaches` table (cross-device sync) */
/* ------------------------------------------------------------------ */

/**
 * Upsert one coach row (insert or update by id) and return the saved row.
 * `upsert` keeps sync idempotent: re-pushing a device-local record that
 * already exists remotely updates it instead of erroring.
 */
export async function supabaseUpsertCoach(coach, client = supabase) {
  const row = {
    ...toCoachApiPayload(coach),
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await client
    .from(CAREER_COACHES_TABLE)
    .upsert(row)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Fetch every coach row from Supabase, newest first. */
export async function supabaseListCoaches(client = supabase) {
  const { data, error } = await client
    .from(CAREER_COACHES_TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return Array.isArray(data) ? data : [];
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
 * Create a coach and return the saved record (including `added_by`).
 * Persists to the shared backend (Supabase `career_coaches` upsert) and
 * falls back to the local adapter when no backend is configured or the
 * request fails, so the app keeps working per-device offline.
 */
export async function createCoach(coach, client = supabase) {
  const payload = toCoachApiPayload(coach);
  if (isCoachApiRemote) {
    try {
      const row = await remoteRequest(coachApiRoutes.create, { method: 'POST', body: JSON.stringify(payload) });
      return fromCoachApiRecord(row ?? payload);
    } catch (error) {
      console.warn('[Coach API] POST /api/coaches failed; saving locally instead.', error);
    }
  }
  if (isSupabaseConfigured) {
    try {
      return fromCoachApiRecord(await supabaseUpsertCoach(coach, client));
    } catch (error) {
      console.warn('[Coach API] Supabase create failed; saving locally instead.', error);
    }
  }
  const rows = readLocalRows().filter((row) => String(row?.id) !== payload.id);
  rows.unshift(payload);
  writeLocalRows(rows);
  return fromCoachApiRecord(payload);
}

/**
 * Update a coach and return the saved record (including `added_by`).
 * Same backend priority and offline fallback as createCoach.
 */
export async function updateCoach(coach, client = supabase) {
  const payload = toCoachApiPayload(coach);
  if (isCoachApiRemote) {
    try {
      const row = await remoteRequest(coachApiRoutes.update(payload.id), { method: 'PUT', body: JSON.stringify(payload) });
      return fromCoachApiRecord(row ?? payload);
    } catch (error) {
      console.warn('[Coach API] PUT /api/coaches/:id failed; saving locally instead.', error);
    }
  }
  if (isSupabaseConfigured) {
    try {
      return fromCoachApiRecord(await supabaseUpsertCoach(coach, client));
    } catch (error) {
      console.warn('[Coach API] Supabase update failed; saving locally instead.', error);
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
 * Fetch all coaches (including `added_by`) as coach state.
 * Throws when a configured remote backend fails, so callers can keep
 * device-local data instead of silently overwriting it.
 */
export async function fetchCoaches(client = supabase) {
  if (isCoachApiRemote) {
    const rows = await remoteRequest(coachApiRoutes.list, { method: 'GET' });
    return (Array.isArray(rows) ? rows : []).map(fromCoachApiRecord);
  }
  if (isSupabaseConfigured) {
    const rows = await supabaseListCoaches(client);
    return rows.map(fromCoachApiRecord);
  }
  return readStoredCoaches();
}

/**
 * Delete a coach from the shared backend and the local cache. Propagating
 * deletes keeps a removed coach from being resurrected by the next sync.
 */
export async function deleteCoach(id, client = supabase) {
  const coachId = String(id ?? '');
  if (isCoachApiRemote) {
    try {
      await remoteRequest(coachApiRoutes.remove(coachId), { method: 'DELETE' });
    } catch (error) {
      console.warn('[Coach API] DELETE /api/coaches/:id failed; removing locally instead.', error);
    }
  }
  if (isSupabaseConfigured) {
    try {
      const { error } = await client.from(CAREER_COACHES_TABLE).delete().eq('id', coachId);
      if (error) throw error;
    } catch (error) {
      console.warn('[Coach API] Supabase delete failed; removing locally instead.', error);
    }
  }
  const rows = readLocalRows().filter((row) => String(row?.id) !== coachId);
  writeLocalRows(rows);
}

/**
 * Compute which device-local coaches the shared backend has never seen.
 * Used by the sync step to push them up without duplicating remote rows.
 */
export function coachesMissingFromRemote(remoteCoaches = [], localCoaches = []) {
  const remoteIds = new Set(remoteCoaches.map((coach) => String(coach.id)));
  return localCoaches.filter((coach) => !remoteIds.has(String(coach.id)));
}
