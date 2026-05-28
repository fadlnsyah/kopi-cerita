-- Seed common drink customizations for existing products.
INSERT INTO "ProductModifier" ("id", "productId", "name", "type", "required", "options", "sortOrder")
SELECT
  'mod_' || substring(md5(random()::text || p.id || 'size'), 1, 20),
  p.id,
  'Ukuran',
  'single',
  true,
  '[{"label":"Regular","price":0},{"label":"Large","price":5000}]'::jsonb,
  1
FROM "Product" p
WHERE p.category IN ('espresso', 'manual-brew', 'non-coffee')
  AND NOT EXISTS (
    SELECT 1 FROM "ProductModifier" m WHERE m."productId" = p.id AND m.name = 'Ukuran'
  );

INSERT INTO "ProductModifier" ("id", "productId", "name", "type", "required", "options", "sortOrder")
SELECT
  'mod_' || substring(md5(random()::text || p.id || 'sugar'), 1, 20),
  p.id,
  'Gula',
  'single',
  true,
  '[{"label":"Normal","price":0},{"label":"50%","price":0},{"label":"Tanpa Gula","price":0}]'::jsonb,
  2
FROM "Product" p
WHERE p.category IN ('espresso', 'manual-brew', 'non-coffee')
  AND NOT EXISTS (
    SELECT 1 FROM "ProductModifier" m WHERE m."productId" = p.id AND m.name = 'Gula'
  );

INSERT INTO "ProductModifier" ("id", "productId", "name", "type", "required", "options", "sortOrder")
SELECT
  'mod_' || substring(md5(random()::text || p.id || 'addons'), 1, 20),
  p.id,
  'Tambahan',
  'multi',
  false,
  '[{"label":"Extra Shot","price":6000},{"label":"Oat Milk","price":8000},{"label":"Caramel","price":4000}]'::jsonb,
  3
FROM "Product" p
WHERE p.category IN ('espresso', 'manual-brew', 'non-coffee')
  AND NOT EXISTS (
    SELECT 1 FROM "ProductModifier" m WHERE m."productId" = p.id AND m.name = 'Tambahan'
  );

