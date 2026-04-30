// Convert snake_case Supabase rows to camelCase JSON for API responses.
// Mirrors the field shape the frontend expects (previously done by mappers in src/context/AppContext.jsx).

export function mapCategory(c) {
  if (!c) return null;
  return {
    id: c.id,
    name: c.name,
    nameEn: c.name_en,
    nameCn: c.name_cn,
    icon: c.icon,
    sortOrder: c.sort_order,
  };
}

export function mapProductUnit(u) {
  if (!u) return null;
  return {
    id: u.id,
    productId: u.product_id,
    label: u.label,
    labelEn: u.label_en,
    labelCn: u.label_cn,
    price: u.price != null ? parseFloat(u.price) : 0,
    sortOrder: u.sort_order ?? 0,
  };
}

export function mapStore(s) {
  if (!s) return null;
  return {
    id: s.id,
    ownerId: s.owner_id,
    name: s.name,
    nameEn: s.name_en,
    nameCn: s.name_cn,
    owner: s.owner_name,
    description: s.description,
    descriptionEn: s.description_en,
    descriptionCn: s.description_cn,
    address: s.address,
    addressEn: s.address_en,
    addressCn: s.address_cn,
    pickup: s.pickup_info,
    pickupEn: s.pickup_info_en,
    pickupCn: s.pickup_info_cn,
    phone: s.phone,
    avatar: s.avatar_url || '🏪',
    rating: s.rating != null ? parseFloat(s.rating) : 0,
    totalSales: s.total_sales || 0,
    isActive: s.is_active,
    createdAt: s.created_at,
  };
}

export function mapProduct(p) {
  if (!p) return null;
  const units = (p.product_units || [])
    .map(mapProductUnit)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const out = {
    id: p.id,
    storeId: p.store_id,
    name: p.name,
    nameEn: p.name_en,
    nameCn: p.name_cn,
    description: p.description,
    descriptionEn: p.description_en,
    descriptionCn: p.description_cn,
    category: p.category_id,
    images: p.images || [],
    featured: p.is_featured,
    isActive: p.is_active,
    createdAt: p.created_at,
    units,
  };
  if (p.stores) out.store = mapStore(p.stores);
  return out;
}

export function mapOrderItem(oi) {
  if (!oi) return null;
  return {
    id: oi.id,
    orderId: oi.order_id,
    productId: oi.product_id,
    productName: oi.product_name,
    unitLabel: oi.unit_label,
    unitPrice: oi.unit_price != null ? parseFloat(oi.unit_price) : 0,
    qty: oi.qty,
    subtotal: oi.subtotal != null ? parseFloat(oi.subtotal) : 0,
  };
}

export function mapOrder(o) {
  if (!o) return null;
  // Orders are returned with either order_items (Supabase join) or items (createOrder result)
  const rawItems = o.order_items || o.items || [];
  const out = {
    id: o.id,
    orderNumber: o.order_number,
    storeId: o.store_id,
    buyerId: o.buyer_id,
    status: o.status,
    total: o.total != null ? parseFloat(o.total) : 0,
    note: o.note,
    items: rawItems.map(mapOrderItem),
    createdAt: o.created_at,
    updatedAt: o.updated_at,
  };
  if (o.stores) out.store = mapStore(o.stores);
  return out;
}

export function mapProfile(p) {
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    nameEn: p.name_en,
    nameCn: p.name_cn,
    avatar: p.avatar_url,
    role: p.role,
    lineId: p.line_id,
    createdAt: p.created_at,
  };
}

export function mapSession(s) {
  if (!s) return null;
  return {
    accessToken: s.access_token,
    refreshToken: s.refresh_token,
    expiresAt: s.expires_at,
    expiresIn: s.expires_in,
    tokenType: s.token_type,
  };
}
