-- Seed categories (matches frontend CATEGORIES)
INSERT INTO categories (id, name, name_en, name_cn, icon, sort_order) VALUES
  ('all',        'ทั้งหมด',   'All',         '全部',   '🏠', 0),
  ('orange',     'ส้ม',       'Orange',      '橙子',   '🍊', 1),
  ('durian',     'ทุเรียน',   'Durian',      '榴莲',   '🌳', 2),
  ('mango',      'มะม่วง',    'Mango',       '芒果',   '🥭', 3),
  ('pomelo',     'ส้มโอ',     'Pomelo',      '柚子',   '🍈', 4),
  ('mangosteen', 'มังคุด',    'Mangosteen',  '山竹',   '🫐', 5),
  ('rambutan',   'เงาะ',      'Rambutan',    '红毛丹', '🔴', 6),
  ('longan',     'ลำไย',      'Longan',      '龙眼',   '🟤', 7);
