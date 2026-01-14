import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/products
 * List semua produk
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil produk' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/products
 * Tambah produk baru
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, price, category, image, isPopular, isNew } = body;

    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Nama, deskripsi, harga, dan kategori harus diisi' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseInt(price),
        category,
        image: image || null,
        isPopular: isPopular || false,
        isNew: isNew || false,
      },
    });

    return NextResponse.json(
      { message: 'Produk berhasil ditambahkan', product },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan produk' },
      { status: 500 }
    );
  }
}
