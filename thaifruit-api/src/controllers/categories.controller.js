import { supabaseAdmin } from '../config/supabase.js';
import { mapCategory } from '../utils/mappers.js';

export async function list(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    res.json(data.map(mapCategory));
  } catch (err) {
    next(err);
  }
}
