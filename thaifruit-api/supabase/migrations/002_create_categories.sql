-- Categories reference table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  name_cn TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0
);

-- No RLS needed — public read-only, managed by admin
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT USING (true);
