import { prisma } from '@/lib/prisma';
import { OrderContextItem } from './types';

export async function getOrderContext(userId?: string): Promise<{
  orderAuthState: 'authenticated' | 'unauthenticated';
  orders: OrderContextItem[];
}> {
  if (!userId) {
    return { orderAuthState: 'unauthenticated', orders: [] };
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: {
      items: {
        include: {
          product: {
            select: { name: true },
          },
        },
      },
    },
  });

  return {
    orderAuthState: 'authenticated',
    orders: orders.map((order) => ({
      id: order.id,
      status: order.status,
      total: order.total,
      orderType: order.orderType,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => `${item.quantity}x ${item.product.name}`),
    })),
  };
}

export function formatOrderContext(
  orderAuthState: 'authenticated' | 'unauthenticated',
  orders: OrderContextItem[]
) {
  if (orderAuthState === 'unauthenticated') {
    return 'User belum login. Untuk pertanyaan status pesanan, minta user login terlebih dahulu.';
  }

  if (orders.length === 0) {
    return 'User sudah login tetapi belum memiliki pesanan.';
  }

  return orders
    .map((order, index) => {
      const label = index === 0 ? 'Order terakhir' : `Order ${index + 1}`;
      return `- ${label}: status ${order.status}, total ${order.total}, tipe ${order.orderType}, dibuat ${order.createdAt}, item ${order.items.join(', ')}.`;
    })
    .join('\n');
}
