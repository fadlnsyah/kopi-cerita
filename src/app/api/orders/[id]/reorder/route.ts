import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/orders/[id]/reorder - Re-add order items to cart
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = await params;
    
    // Get the order
    const order = await prisma.order.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                category: true,
              },
            },
          },
        },
      },
    });
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    // Get or create user's cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });
    
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
      });
    }
    
    // Add each item to cart
    for (const item of order.items) {
      const existingCartItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: item.productId,
          },
        },
      });
      
      if (existingCartItem) {
        // Update quantity
        await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + item.quantity },
        });
      } else {
        // Create new cart item
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: item.productId,
            quantity: item.quantity,
          },
        });
      }
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Items added to cart',
      itemCount: order.items.length,
    });
  } catch (error) {
    console.error('Error reordering:', error);
    return NextResponse.json({ error: 'Failed to reorder' }, { status: 500 });
  }
}
