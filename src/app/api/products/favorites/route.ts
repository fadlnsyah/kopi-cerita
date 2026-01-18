import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products/favorites - Get popular/featured products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isPopular: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: true,
        image: true,
        isPopular: true,
        isNew: true,
        averageRating: true,
        reviewCount: true,
        discountPercent: true,
      },
      orderBy: [
        { averageRating: 'desc' },
        { reviewCount: 'desc' },
      ],
      take: 6,
    });
    
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
