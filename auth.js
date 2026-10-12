import { supabase, isSupabaseConfigured } from './supabaseClient.js';

/**
 * Sign in user using Supabase password authentication
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ data: any, error: any }>}
 */
export async function signIn({ email, password }) {
  if (!isSupabaseConfigured) {
    return {
      data: { user: null, session: null },
      error: new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.')
    };
  }
  return await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
}

/**
 * Sign out the currently authenticated user
 * @returns {Promise<{ error: any }>}
 */
export async function signOut() {
  if (!isSupabaseConfigured) {
    return { error: null };
  }
  return await supabase.auth.signOut();
}

/**
 * Fetch the current active session
 * @returns {Promise<{ data: { session: any }, error: any }>}
 */
export async function getSession() {
  if (!isSupabaseConfigured) {
    return { data: { session: null }, error: null };
  }
  return await supabase.auth.getSession();
}

/**
 * Fetch the current authenticated user
 * @returns {Promise<{ data: { user: any }, error: any }>}
 */
export async function getUser() {
  if (!isSupabaseConfigured) {
    return { data: { user: null }, error: null };
  }
  return await supabase.auth.getUser();
}

/**
 * Subscribe to Supabase auth state changes
 * @param {(event: string, session: any) => void} callback
 * @returns {{ data: { subscription: any } }}
 */
export function onAuthStateChange(callback) {
  if (!isSupabaseConfigured) {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
  return supabase.auth.onAuthStateChange(callback);
}

/**
 * Initialize auth listener and initial session check to manage UI state transitions
 * @param {{ onAuthenticated: (session: any, event?: string) => void, onUnauthenticated: (event?: string) => void }} handlers
 * @returns {() => void} Cleanup function to unsubscribe
 */
export function initAuth({ onAuthenticated, onUnauthenticated }) {
  // Immediate check for existing persisted session
  getSession()
    .then(({ data: { session } }) => {
      if (session) {
        onAuthenticated?.(session, 'INITIAL_SESSION');
      } else {
        onUnauthenticated?.('INITIAL_SESSION');
      }
    })
    .catch((err) => {
      console.error('[Supabase Auth] Failed to restore session:', err);
      onUnauthenticated?.('INITIAL_SESSION');
    });

  // Listen for real-time auth events (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, etc.)
  const { data: { subscription } } = onAuthStateChange((event, session) => {
    if (session) {
      onAuthenticated?.(session, event);
    } else {
      onUnauthenticated?.(event);
    }
  });

  return () => {
    subscription?.unsubscribe();
  };
}
