import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/cart
 * Ambil cart user yang sedang login
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Cari atau buat cart untuk user
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                category: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  category: true,
                  image: true,
                },
              },
            },
          },
        },
      });
    }

    // Transform data untuk frontend
    const cartItems = cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      category: item.product.category,
      image: item.product.image,
      quantity: item.quantity,
    }));

    return NextResponse.json({ items: cartItems });
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil cart' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart
 * Tambah item ke cart
 * Body: { productId: string, quantity?: number }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID diperlukan' },
        { status: 400 }
      );
    }

    // Cek apakah product ada
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produk tidak ditemukan' },
        { status: 404 }
      );
    }

    // Cari atau buat cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
      });
    }

    // Cek apakah item sudah ada di cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Tambah item baru
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity,
        },
      });
    }

    return NextResponse.json({ message: 'Item ditambahkan ke cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan ke cart' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cart
 * Update quantity item
 * Body: { itemId: string, quantity: number }
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { itemId, quantity } = body;

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Item ID dan quantity diperlukan' },
        { status: 400 }
      );
    }

    // Verifikasi item milik user
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Item tidak ditemukan' },
        { status: 404 }
      );
    }

    if (quantity <= 0) {
      // Hapus item
      await prisma.cartItem.delete({
        where: { id: itemId },
      });
      return NextResponse.json({ message: 'Item dihapus dari cart' });
    }

    // Update quantity
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return NextResponse.json({ message: 'Quantity diperbarui' });
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui cart' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart?itemId=xxx
 * Hapus item dari cart
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID diperlukan' },
        { status: 400 }
      );
    }

    // Verifikasi item milik user
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Item tidak ditemukan' },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ message: 'Item dihapus dari cart' });
  } catch (error) {
    console.error('Delete cart item error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus item' },
      { status: 500 }
    );
  }
}
