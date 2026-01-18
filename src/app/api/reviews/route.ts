import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/reviews?productId=xxx - Get reviews for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }
    
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST /api/reviews - Create a review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { productId, orderId, rating, comment } = body;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }
    
    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }
    
    // Check if user already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });
    
    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 });
    }
    
    // Check if this is a verified purchase (user has completed order with this product)
    let isVerified = false;
    if (orderId) {
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          userId: session.user.id,
          status: 'delivered',
          items: {
            some: { productId },
          },
        },
      });
      isVerified = !!order;
    } else {
      // Check if user has any delivered order with this product
      const order = await prisma.order.findFirst({
        where: {
          userId: session.user.id,
          status: 'delivered',
          items: {
            some: { productId },
          },
        },
      });
      isVerified = !!order;
    }
    
    // Create the review
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId,
        orderId: orderId || null,
        rating,
        comment: comment || null,
        isVerified,
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });
    
    // Update product average rating and review count
    const productReviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });
    
    const totalRatings = productReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRatings / productReviews.length;
    
    await prisma.product.update({
      where: { id: productId },
      data: {
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        reviewCount: productReviews.length,
      },
    });
    
    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
