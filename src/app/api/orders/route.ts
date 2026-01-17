import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
    const { notes } = body;

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

    // Hitung total (termasuk biaya layanan Rp 2.000)
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const serviceFee = 2000;
    const total = subtotal + serviceFee;

    // Buat order dengan transaction untuk memastikan atomicity
    const order = await prisma.$transaction(async (tx) => {
      // 1. Buat Order
      const newOrder = await tx.order.create({
        data: {
          userId,
          total,
          status: 'pending',
          notes: notes || null,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price, // Simpan harga saat order
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
                name: true,
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
