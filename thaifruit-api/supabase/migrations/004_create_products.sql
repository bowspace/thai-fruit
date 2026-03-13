-- Products table
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

-- Full-text search index
CREATE INDEX idx_products_search ON products
  USING GIN (to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(name_en, '') || ' ' || coalesce(description, '')));

-- Product units (pricing tiers)
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

-- RLS
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
