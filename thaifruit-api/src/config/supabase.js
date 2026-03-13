import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

// Service role client — bypasses RLS, used for server-side operations
export const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceKey);

// Create a user-scoped client from a JWT token (respects RLS)
export function supabaseForUser(token) {
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}
