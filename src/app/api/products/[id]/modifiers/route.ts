import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products/[id]/modifiers - Get product modifiers
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const modifiers = await prisma.productModifier.findMany({
      where: { productId: id },
      orderBy: { sortOrder: 'asc' },
    });
    
    return NextResponse.json({ modifiers });
  } catch (error) {
    console.error('Error fetching modifiers:', error);
    return NextResponse.json({ error: 'Failed to fetch modifiers' }, { status: 500 });
  }
}
