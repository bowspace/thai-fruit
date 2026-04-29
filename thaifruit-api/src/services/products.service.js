import { supabaseAdmin } from '../config/supabase.js';
import { paginate } from '../utils/pagination.js';
import { mapProduct } from '../utils/mappers.js';

export async function listProducts({ q, category, store_id, featured, page, limit }) {
  const { from, to } = paginate(page, limit);

  let query = supabaseAdmin
    .from('products')
    .select('*, product_units(*), stores!inner(id, name, name_en, name_cn, avatar_url, rating)', { count: 'exact' })
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (category) query = query.eq('category_id', category);
  if (store_id) query = query.eq('store_id', store_id);
  if (featured === 'true') query = query.eq('is_featured', true);
  if (q) query = query.or(`name.ilike.%${q}%,name_en.ilike.%${q}%,description.ilike.%${q}%`);

  const { data, error, count } = await query;
  if (error) throw error;

  return { products: data.map(mapProduct), total: count, page, limit };
}

export async function getProductById(id) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*, product_units(*), stores(id, name, name_en, name_cn, avatar_url, rating, total_sales, description, description_en, description_cn, address, address_en, phone)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return mapProduct(data);
}

export async function getRelatedProducts(productId, categoryId, storeId) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*, product_units(*), stores!inner(id, name, name_en, name_cn, avatar_url)')
    .eq('is_active', true)
    .neq('id', productId)
    .or(`category_id.eq.${categoryId},store_id.eq.${storeId}`)
    .limit(4);
  if (error) throw error;
  return data.map(mapProduct);
}

export async function createProduct(storeId, productData) {
  const { units, ...productFields } = productData;

  // Insert product
  const { data: product, error } = await supabaseAdmin
    .from('products')
    .insert({ ...productFields, store_id: storeId })
    .select()
    .single();
  if (error) throw error;

  // Insert units
  if (units?.length) {
    const unitRows = units.map((u, i) => ({
      product_id: product.id,
      label: u.label,
      label_en: u.label_en,
      label_cn: u.label_cn,
      price: u.price,
      sort_order: u.sort_order ?? i,
    }));

    const { error: unitError } = await supabaseAdmin
      .from('product_units')
      .insert(unitRows);
    if (unitError) throw unitError;
  }

  return getProductById(product.id);
}

export async function updateProduct(id, storeId, productData) {
  const { units, ...productFields } = productData;

  // Verify ownership
  const { data: existing } = await supabaseAdmin
    .from('products')
    .select('id')
    .eq('id', id)
    .eq('store_id', storeId)
    .single();
  if (!existing) throw new Error('Product not found or not owned by your store');

  // Update product fields
  if (Object.keys(productFields).length > 0) {
    const { error } = await supabaseAdmin
      .from('products')
      .update({ ...productFields, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }

  // Replace units if provided
  if (units) {
    await supabaseAdmin.from('product_units').delete().eq('product_id', id);

    const unitRows = units.map((u, i) => ({
      product_id: id,
      label: u.label,
      label_en: u.label_en,
      label_cn: u.label_cn,
      price: u.price,
      sort_order: u.sort_order ?? i,
    }));

    const { error: unitError } = await supabaseAdmin
      .from('product_units')
      .insert(unitRows);
    if (unitError) throw unitError;
  }

  return getProductById(id);
}

export async function deleteProduct(id, storeId) {
  const { error } = await supabaseAdmin
    .from('products')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('store_id', storeId);
  if (error) throw error;
}
