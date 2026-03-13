import { supabaseAdmin } from '../config/supabase.js';

export async function signup({ email, password, name, role }) {
  // Create auth user
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (authError) throw authError;

  // Create profile
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({ id: authData.user.id, name, role });
  if (profileError) throw profileError;

  // Sign in to get session
  const { data: session, error: loginError } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  });
  if (loginError) throw loginError;

  return {
    user: { id: authData.user.id, email, name, role },
    session: session.session,
  };
}

export async function login({ email, password }) {
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  return {
    user: { ...profile },
    session: data.session,
  };
}

export async function getProfile(userId) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}
