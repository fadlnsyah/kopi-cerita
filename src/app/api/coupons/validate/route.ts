import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/coupons/validate - Validate a coupon code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, subtotal } = body;
    
    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }
    
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });
    
    if (!coupon) {
      return NextResponse.json({ error: 'Kode kupon tidak ditemukan' }, { status: 404 });
    }
    
    // Check if coupon is active
    if (!coupon.isActive) {
      return NextResponse.json({ error: 'Kupon sudah tidak aktif' }, { status: 400 });
    }
    
    // Check validity period
    const now = new Date();
    if (now < coupon.validFrom) {
      return NextResponse.json({ error: 'Kupon belum berlaku' }, { status: 400 });
    }
    
    if (now > coupon.validUntil) {
      return NextResponse.json({ error: 'Kupon sudah kadaluarsa' }, { status: 400 });
    }
    
    // Check max uses
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: 'Kupon sudah mencapai batas penggunaan' }, { status: 400 });
    }
    
    // Check minimum purchase
    if (coupon.minPurchase && subtotal && subtotal < coupon.minPurchase) {
      return NextResponse.json({ 
        error: `Minimal pembelian Rp ${coupon.minPurchase.toLocaleString('id-ID')} untuk kupon ini` 
      }, { status: 400 });
    }
    
    // Calculate discount
    const discountAmount = subtotal ? Math.floor((subtotal * coupon.discount) / 100) : 0;
    
    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discount: coupon.discount,
        discountAmount,
        minPurchase: coupon.minPurchase,
      },
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
