import { supabaseAdmin } from '../config/supabase.js';
import { generateOrderNumber } from '../utils/orderNumber.js';

export async function createOrder(buyerId, { items, note }) {
  // Fetch all products and units for the order items
  const productIds = [...new Set(items.map(i => i.product_id))];
  const unitIds = [...new Set(items.map(i => i.unit_id))];

  const { data: products } = await supabaseAdmin
    .from('products')
    .select('id, name, store_id')
    .in('id', productIds);

  const { data: units } = await supabaseAdmin
    .from('product_units')
    .select('id, label, price, product_id')
    .in('id', unitIds);

  if (!products?.length || !units?.length) {
    throw new Error('Invalid product or unit references');
  }

  // Build lookup maps
  const productMap = Object.fromEntries(products.map(p => [p.id, p]));
  const unitMap = Object.fromEntries(units.map(u => [u.id, u]));

  // Group items by store
  const storeGroups = {};
  for (const item of items) {
    const product = productMap[item.product_id];
    const unit = unitMap[item.unit_id];
    if (!product || !unit) throw new Error(`Invalid item: product ${item.product_id} or unit ${item.unit_id}`);

    const storeId = product.store_id;
    if (!storeGroups[storeId]) storeGroups[storeId] = [];
    storeGroups[storeId].push({
      product,
      unit,
      qty: item.qty,
      subtotal: unit.price * item.qty,
    });
  }

  // Create one order per store
  const createdOrders = [];
  for (const [storeId, storeItems] of Object.entries(storeGroups)) {
    const total = storeItems.reduce((s, i) => s + i.subtotal, 0);

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: generateOrderNumber(),
        store_id: storeId,
        buyer_id: buyerId,
        total,
        note: note || null,
        status: 'pending',
      })
      .select()
      .single();
    if (orderError) throw orderError;

    const orderItems = storeItems.map(i => ({
      order_id: order.id,
      product_id: i.product.id,
      product_name: i.product.name,
      unit_label: i.unit.label,
      unit_price: i.unit.price,
      qty: i.qty,
      subtotal: i.subtotal,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);
    if (itemsError) throw itemsError;

    createdOrders.push({ ...order, items: orderItems });
  }

  return createdOrders;
}

export async function listOrders(userId, role) {
  let query = supabaseAdmin
    .from('orders')
    .select('*, order_items(*), stores(name, name_en, name_cn)')
    .order('created_at', { ascending: false });

  if (role === 'seller') {
    // Get seller's store
    const { data: store } = await supabaseAdmin
      .from('stores')
      .select('id')
      .eq('owner_id', userId)
      .single();
    if (!store) return [];
    query = query.eq('store_id', store.id);
  } else {
    query = query.eq('buyer_id', userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getOrderById(id, userId) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(*), stores(name, name_en, name_cn, phone)')
    .eq('id', id)
    .single();
  if (error) throw error;

  // Verify access
  if (data.buyer_id !== userId) {
    const { data: store } = await supabaseAdmin
      .from('stores')
      .select('owner_id')
      .eq('id', data.store_id)
      .single();
    if (store?.owner_id !== userId) throw new Error('Access denied');
  }

  return data;
}

export async function updateOrderStatus(id, storeOwnerId, status) {
  // Verify the store owner
  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('store_id')
    .eq('id', id)
    .single();
  if (!order) throw new Error('Order not found');

  const { data: store } = await supabaseAdmin
    .from('stores')
    .select('owner_id')
    .eq('id', order.store_id)
    .single();
  if (store?.owner_id !== storeOwnerId) throw new Error('Not your store order');

  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
