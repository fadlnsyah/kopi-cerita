import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        _count: {
          select: { modifiers: true },
        },
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products.map((product) => ({
      ...product,
      hasModifiers: product._count.modifiers > 0,
      _count: undefined,
    })));
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
