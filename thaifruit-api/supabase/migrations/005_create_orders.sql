-- Orders table
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

-- Order items (snapshot of product at purchase time)
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

-- RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Buyers can see their own orders
CREATE POLICY "Buyers can view own orders"
  ON orders FOR SELECT USING (auth.uid() = buyer_id);

-- Store owners can see orders for their store
CREATE POLICY "Sellers can view store orders"
  ON orders FOR SELECT USING (
    store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid())
  );

-- Buyers can create orders
CREATE POLICY "Buyers can create orders"
  ON orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Store owners can update order status
CREATE POLICY "Sellers can update order status"
  ON orders FOR UPDATE USING (
    store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid())
  );

-- Order items follow parent order access
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
