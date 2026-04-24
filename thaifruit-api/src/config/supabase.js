import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

// Service role client — bypasses RLS, used for server-side operations
export const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceKey);

// Anon client — for operations that don't need admin (e.g., signInWithPassword)
export const supabaseAnon = createClient(env.supabaseUrl, env.supabaseAnonKey);

// Create a user-scoped client from a JWT token (respects RLS)
export function supabaseForUser(token) {
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}
