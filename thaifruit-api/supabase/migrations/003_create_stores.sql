-- Stores table
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

-- RLS
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stores are viewable by everyone"
  ON stores FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create a store"
  ON stores FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Store owners can update their store"
  ON stores FOR UPDATE USING (auth.uid() = owner_id);
