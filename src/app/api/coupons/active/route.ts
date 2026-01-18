import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/coupons/active - Get all active coupons for promo banner
export async function GET() {
  try {
    const now = new Date();
    
    const coupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        validFrom: { lte: now },
        validUntil: { gte: now },
        OR: [
          { maxUses: null },
          { usedCount: { lt: prisma.coupon.fields.maxUses } },
        ],
      },
      select: {
        id: true,
        code: true,
        discount: true,
        minPurchase: true,
        validUntil: true,
      },
      orderBy: { discount: 'desc' },
      take: 5,
    });
    
    return NextResponse.json({ coupons });
  } catch (error) {
    console.error('Error fetching active coupons:', error);
    return NextResponse.json({ coupons: [] });
  }
}
