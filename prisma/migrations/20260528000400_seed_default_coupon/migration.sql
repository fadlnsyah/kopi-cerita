-- Seed a default active coupon for promo banner and checkout testing.
INSERT INTO "Coupon" ("id", "code", "discount", "minPurchase", "maxUses", "usedCount", "validFrom", "validUntil", "isActive", "createdAt")
SELECT
  'coupon_welcome10',
  'WELCOME10',
  10,
  50000,
  NULL,
  0,
  CURRENT_TIMESTAMP,
  TIMESTAMP '2030-12-31 23:59:59',
  true,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM "Coupon" WHERE "code" = 'WELCOME10'
);

