import { prisma } from '@/lib/prisma';
import { CouponContextItem } from './types';

export async function getCouponContext(): Promise<CouponContextItem[]> {
  const now = new Date();

  const coupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
      validFrom: { lte: now },
      validUntil: { gte: now },
    },
    orderBy: [{ discount: 'desc' }, { validUntil: 'asc' }],
    take: 8,
  });

  return coupons
    .filter((coupon) => !coupon.maxUses || coupon.usedCount < coupon.maxUses)
    .map((coupon) => ({
      code: coupon.code,
      discount: coupon.discount,
      minPurchase: coupon.minPurchase,
      validUntil: coupon.validUntil.toISOString(),
      remainingUses: coupon.maxUses ? Math.max(coupon.maxUses - coupon.usedCount, 0) : null,
    }));
}

export function formatCouponContext(coupons: CouponContextItem[]) {
  if (coupons.length === 0) {
    return 'Tidak ada kupon atau promo aktif saat ini.';
  }

  return coupons
    .map((coupon) => {
      const minPurchase = coupon.minPurchase
        ? `minimal belanja ${coupon.minPurchase}`
        : 'tanpa minimal belanja';
      const quota = coupon.remainingUses === null
        ? 'tanpa limit penggunaan tercatat'
        : `sisa ${coupon.remainingUses} penggunaan`;

      return `- ${coupon.code}: diskon ${coupon.discount}%, ${minPurchase}, berlaku sampai ${coupon.validUntil}, ${quota}.`;
    })
    .join('\n');
}
