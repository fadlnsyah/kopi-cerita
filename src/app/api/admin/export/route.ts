import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/export
 * 
 * Export laporan penjualan dalam format CSV
 * Query params:
 * - startDate: tanggal mulai (YYYY-MM-DD)
 * - endDate: tanggal akhir (YYYY-MM-DD)
 * - format: 'csv' (default) atau 'json'
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const format = searchParams.get('format') || 'csv';

    // Build date filter
    const dateFilter: { createdAt?: { gte?: Date; lte?: Date } } = {};
    
    if (startDate) {
      dateFilter.createdAt = {
        ...dateFilter.createdAt,
        gte: new Date(startDate),
      };
    }
    
    if (endDate) {
      // Add 23:59:59 to include the full end date
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      dateFilter.createdAt = {
        ...dateFilter.createdAt,
        lte: endDateTime,
      };
    }

    // Fetch orders with items and user info
    const orders = await prisma.order.findMany({
      where: {
        ...dateFilter,
        status: {
          not: 'cancelled',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                category: true,
              },
            },
          },
        },
      },
    });

    // Calculate summary
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalItems = orders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    // If JSON format requested, return full data
    if (format === 'json') {
      return NextResponse.json({
        summary: {
          totalOrders,
          totalRevenue,
          totalItems,
          dateRange: {
            start: startDate || 'All time',
            end: endDate || 'Now',
          },
        },
        orders: orders.map(order => ({
          id: order.id,
          date: order.createdAt.toISOString(),
          customer: order.user.name,
          email: order.user.email,
          status: order.status,
          total: order.total,
          items: order.items.map(item => ({
            product: item.product.name,
            category: item.product.category,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
          })),
        })),
      });
    }

    // Generate CSV content
    const csvRows: string[] = [];

    // Header row
    csvRows.push([
      'Order ID',
      'Tanggal',
      'Pelanggan',
      'Email',
      'Status',
      'Produk',
      'Kategori',
      'Qty',
      'Harga Satuan',
      'Subtotal',
      'Total Order',
    ].join(','));

    // Data rows - one row per order item
    orders.forEach(order => {
      order.items.forEach((item, index) => {
        csvRows.push([
          index === 0 ? order.id : '', // Only show order ID on first item row
          index === 0 ? formatDate(order.createdAt) : '',
          index === 0 ? escapeCSV(order.user.name) : '',
          index === 0 ? order.user.email : '',
          index === 0 ? order.status : '',
          escapeCSV(item.product.name),
          item.product.category,
          item.quantity.toString(),
          item.price.toString(),
          (item.price * item.quantity).toString(),
          index === 0 ? order.total.toString() : '',
        ].join(','));
      });
    });

    // Add summary rows at the end
    csvRows.push('');
    csvRows.push(`RINGKASAN LAPORAN`);
    csvRows.push(`Periode,${startDate || 'Awal'} - ${endDate || 'Sekarang'}`);
    csvRows.push(`Total Pesanan,${totalOrders}`);
    csvRows.push(`Total Item Terjual,${totalItems}`);
    csvRows.push(`Total Pendapatan,${totalRevenue}`);

    const csvContent = csvRows.join('\n');

    // Generate filename with date range
    const filename = generateFilename(startDate, endDate);

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Gagal mengexport laporan' },
      { status: 500 }
    );
  }
}

// Helper: Format date to DD/MM/YYYY
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

// Helper: Escape CSV special characters
function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

// Helper: Generate filename
function generateFilename(startDate: string | null, endDate: string | null): string {
  const now = new Date();
  const timestamp = now.toISOString().split('T')[0];
  
  if (startDate && endDate) {
    return `laporan-penjualan_${startDate}_to_${endDate}.csv`;
  }
  return `laporan-penjualan_${timestamp}.csv`;
}
