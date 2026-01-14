import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/stats
 * 
 * Mengambil statistik untuk dashboard admin
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get total orders
    const totalOrders = await prisma.order.count();

    // Get total revenue
    const revenueResult = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: {
          not: 'cancelled',
        },
      },
    });
    const totalRevenue = revenueResult._sum.total || 0;

    // Get total products
    const totalProducts = await prisma.product.count();

    // Get total users (customers only)
    const totalUsers = await prisma.user.count({
      where: {
        role: 'customer',
      },
    });

    // Get monthly sales (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
        status: {
          not: 'cancelled',
        },
      },
      select: {
        total: true,
        createdAt: true,
      },
    });

    // Group by month
    const monthlyData: Record<string, number> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    orders.forEach((order) => {
      const month = monthNames[order.createdAt.getMonth()];
      monthlyData[month] = (monthlyData[month] || 0) + order.total;
    });

    // Convert to array for chart
    const monthlySales = Object.entries(monthlyData).map(([month, sales]) => ({
      month,
      sales,
    }));

    // Get top products
    const topProductsData = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    // Get product names
    const productIds = topProductsData.map((p) => p.productId);
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const topProducts = topProductsData.map((p) => {
      const product = products.find((prod) => prod.id === p.productId);
      return {
        name: product?.name || 'Unknown',
        sold: p._sum.quantity || 0,
      };
    });

    // Get recent orders
    const recentOrdersData = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    const recentOrders = recentOrdersData.map((order) => ({
      id: order.id,
      customer: order.user.name,
      total: order.total,
      status: order.status,
      date: new Date(order.createdAt).toLocaleDateString('id-ID'),
    }));

    return NextResponse.json({
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers,
      monthlySales,
      topProducts,
      recentOrders,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil statistik' },
      { status: 500 }
    );
  }
}
