import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function getEffectivePrice(product: { price: number; discountPercent: number | null }) {
  if (product.discountPercent && product.discountPercent > 0) {
    return Math.round(product.price * (1 - product.discountPercent / 100));
  }

  return product.price;
}

/**
 * POST /api/orders
 * 
 * Membuat order baru dari cart items customer
 * - Mengambil cart items dari session user
 * - Membuat Order dan OrderItems
 * - Menghapus cart items setelah order sukses
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Harus login
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Anda harus login untuk membuat pesanan' },
        { status: 401 }
      );
    }

    // Admin tidak boleh membuat order (hanya customer)
    if (session.user.role === 'admin') {
      return NextResponse.json(
        { error: 'Admin tidak bisa membuat pesanan' },
        { status: 403 }
      );
    }

    const userId = session.user.id;

    // Ambil data dari request body
    const body = await request.json();
    const { notes, phone, email, orderType = 'dine-in', couponCode } = body;

    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
      return NextResponse.json(
        { error: 'Nomor WhatsApp wajib diisi dengan benar' },
        { status: 400 }
      );
    }

    if (!['dine-in', 'takeaway'].includes(orderType)) {
      return NextResponse.json(
        { error: 'Tipe pesanan tidak valid' },
        { status: 400 }
      );
    }

    // Ambil cart dan items
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Keranjang kosong' },
        { status: 400 }
      );
    }

    const pricedItems = cart.items.map((item) => ({
      ...item,
      effectivePrice: getEffectivePrice(item.product),
    }));

    const subtotal = cart.items.reduce(
      (sum, item) => sum + getEffectivePrice(item.product) * item.quantity,
      0
    );
    const serviceFee = 2000;

    let discountAmount = 0;
    let appliedCouponCode: string | null = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: String(couponCode).trim().toUpperCase() },
      });
      const now = new Date();

      if (!coupon || !coupon.isActive) {
        return NextResponse.json({ error: 'Kupon tidak valid' }, { status: 400 });
      }

      if (now < coupon.validFrom || now > coupon.validUntil) {
        return NextResponse.json({ error: 'Kupon tidak berlaku' }, { status: 400 });
      }

      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        return NextResponse.json({ error: 'Kupon sudah mencapai batas penggunaan' }, { status: 400 });
      }

      if (coupon.minPurchase && subtotal < coupon.minPurchase) {
        return NextResponse.json(
          { error: `Minimal pembelian Rp ${coupon.minPurchase.toLocaleString('id-ID')} untuk kupon ini` },
          { status: 400 }
        );
      }

      discountAmount = Math.floor((subtotal * coupon.discount) / 100);
      appliedCouponCode = coupon.code;
    }

    const total = subtotal + serviceFee - discountAmount;

    // Buat order dengan transaction untuk memastikan atomicity
    const order = await prisma.$transaction(async (tx) => {
      if (appliedCouponCode) {
        await tx.coupon.update({
          where: { code: appliedCouponCode },
          data: { usedCount: { increment: 1 } },
        });
      }

      // 1. Buat Order
      const newOrder = await tx.order.create({
        data: {
          userId,
          subtotal,
          serviceFee,
          discountAmount,
          total,
          couponCode: appliedCouponCode,
          contactPhone: phone.trim(),
          contactEmail: email?.trim() || session.user.email || null,
          orderType,
          status: 'pending',
          notes: notes || null,
          items: {
            create: pricedItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.effectivePrice,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      // 2. Hapus semua cart items
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return NextResponse.json({
      message: 'Pesanan berhasil dibuat',
      orderId: order.id,
      total: order.total,
      subtotal: order.subtotal,
      serviceFee: order.serviceFee,
      discountAmount: order.discountAmount,
      couponCode: order.couponCode,
      status: order.status,
      items: order.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Gagal membuat pesanan' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders
 * 
 * Mengambil daftar order milik user yang sedang login
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Anda harus login' },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil pesanan' },
      { status: 500 }
    );
  }
}
