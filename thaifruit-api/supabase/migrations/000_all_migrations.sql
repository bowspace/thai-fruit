-- ============================================
-- ThaiFruit Marketplace — Full Database Setup
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- 1. PROFILES
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_en TEXT,
  name_cn TEXT,
  avatar_url TEXT,
  line_id TEXT,
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. CATEGORIES
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  name_cn TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT USING (true);

-- 3. STORES
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL UNIQUE REFERENCES profiles(id),
  name TEXT NOT NULL,
  name_en TEXT,
  name_cn TEXT,
  owner_name TEXT,
  description TEXT,
  description_en TEXT,
  description_cn TEXT,
  address TEXT,
  address_en TEXT,
  address_cn TEXT,
  pickup_info TEXT,
  pickup_info_en TEXT,
  pickup_info_cn TEXT,
  phone TEXT,
  avatar_url TEXT,
  rating NUMERIC(2,1) DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stores are viewable by everyone"
  ON stores FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create a store"
  ON stores FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Store owners can update their store"
  ON stores FOR UPDATE USING (auth.uid() = owner_id);

-- 4. PRODUCTS
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id),
  name TEXT NOT NULL,
  name_en TEXT,
  name_cn TEXT,
  description TEXT,
  description_en TEXT,
  description_cn TEXT,
  category_id TEXT REFERENCES categories(id),
  images TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;

CREATE INDEX idx_products_search ON products
  USING GIN (to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(name_en, '') || ' ' || coalesce(description, '')));

-- PRODUCT UNITS
CREATE TABLE product_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  label_en TEXT,
  label_cn TEXT,
  price NUMERIC(10,2) NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE INDEX idx_product_units_product_id ON product_units(product_id);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_units ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT USING (true);

CREATE POLICY "Store owners can insert products"
  ON products FOR INSERT WITH CHECK (
    store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid())
  );

CREATE POLICY "Store owners can update their products"
  ON products FOR UPDATE USING (
    store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid())
  );

CREATE POLICY "Store owners can delete their products"
  ON products FOR DELETE USING (
    store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid())
  );

CREATE POLICY "Product units are viewable by everyone"
  ON product_units FOR SELECT USING (true);

CREATE POLICY "Store owners can manage product units"
  ON product_units FOR ALL USING (
    product_id IN (
      SELECT p.id FROM products p
      JOIN stores s ON p.store_id = s.id
      WHERE s.owner_id = auth.uid()
    )
  );

-- 5. ORDERS
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  store_id UUID NOT NULL REFERENCES stores(id),
  buyer_id UUID NOT NULL REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'shipped', 'done', 'cancelled')),
  total NUMERIC(10,2) NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_orders_store_id ON orders(store_id);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_status ON orders(status);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  unit_label TEXT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  qty INTEGER NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view own orders"
  ON orders FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can view store orders"
  ON orders FOR SELECT USING (
    store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid())
  );

CREATE POLICY "Buyers can create orders"
  ON orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Sellers can update order status"
  ON orders FOR UPDATE USING (
    store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid())
  );

CREATE POLICY "Order items viewable by order owner"
  ON order_items FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE buyer_id = auth.uid())
  );

CREATE POLICY "Order items viewable by store owner"
  ON order_items FOR SELECT USING (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN stores s ON o.store_id = s.id
      WHERE s.owner_id = auth.uid()
    )
  );

CREATE POLICY "Order items can be inserted with order"
  ON order_items FOR INSERT WITH CHECK (
    order_id IN (SELECT id FROM orders WHERE buyer_id = auth.uid())
  );

-- 6. SEED CATEGORIES
INSERT INTO categories (id, name, name_en, name_cn, icon, sort_order) VALUES
  ('all',        'ทั้งหมด',   'All',         '全部',   '🏠', 0),
  ('orange',     'ส้ม',       'Orange',      '橙子',   '🍊', 1),
  ('durian',     'ทุเรียน',   'Durian',      '榴莲',   '🌳', 2),
  ('mango',      'มะม่วง',    'Mango',       '芒果',   '🥭', 3),
  ('pomelo',     'ส้มโอ',     'Pomelo',      '柚子',   '🍈', 4),
  ('mangosteen', 'มังคุด',    'Mangosteen',  '山竹',   '🫐', 5),
  ('rambutan',   'เงาะ',      'Rambutan',    '红毛丹', '🔴', 6),
  ('longan',     'ลำไย',      'Longan',      '龙眼',   '🟤', 7);
