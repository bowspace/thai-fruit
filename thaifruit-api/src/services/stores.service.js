import { supabaseAdmin } from '../config/supabase.js';

export async function listStores() {
  const { data, error } = await supabaseAdmin
    .from('stores')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getStoreById(id) {
  const { data, error } = await supabaseAdmin
    .from('stores')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function getStoreByOwner(ownerId) {
  const { data, error } = await supabaseAdmin
    .from('stores')
    .select('*')
    .eq('owner_id', ownerId)
    .single();
  if (error) return null;
  return data;
}

export async function createStore(ownerId, storeData) {
  const { data, error } = await supabaseAdmin
    .from('stores')
    .insert({ ...storeData, owner_id: ownerId })
    .select()
    .single();
  if (error) throw error;

  // Update profile role to seller
  await supabaseAdmin
    .from('profiles')
    .update({ role: 'seller' })
    .eq('id', ownerId);

  return data;
}

export async function updateStore(id, ownerId, updates) {
  const { data, error } = await supabaseAdmin
    .from('stores')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('owner_id', ownerId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
