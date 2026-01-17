import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/wishlist
 * Mengambil daftar wishlist user yang sedang login
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

    const wishlists = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            category: true,
            image: true,
            isPopular: true,
            isNew: true,
            discountPercent: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Return products dari wishlist
    const products = wishlists.map((w) => w.product);

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Get wishlist error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil wishlist' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/wishlist
 * Menambahkan produk ke wishlist
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Anda harus login' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID diperlukan' },
        { status: 400 }
      );
    }

    // Check if already in wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Produk sudah ada di wishlist' },
        { status: 400 }
      );
    }

    // Add to wishlist
    const wishlist = await prisma.wishlist.create({
      data: {
        userId: session.user.id,
        productId,
      },
    });

    return NextResponse.json({ 
      message: 'Berhasil ditambahkan ke wishlist',
      wishlistId: wishlist.id,
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan ke wishlist' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/wishlist
 * Menghapus produk dari wishlist
 */
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Anda harus login' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID diperlukan' },
        { status: 400 }
      );
    }

    await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    return NextResponse.json({ message: 'Berhasil dihapus dari wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus dari wishlist' },
      { status: 500 }
    );
  }
}
