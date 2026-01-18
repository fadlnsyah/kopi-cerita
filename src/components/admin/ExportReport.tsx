'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportData {
  summary: {
    totalOrders: number;
    totalRevenue: number;
    totalItems: number;
    dateRange: {
      start: string;
      end: string;
    };
  };
  orders: {
    id: string;
    date: string;
    customer: string;
    email: string;
    status: string;
    total: number;
    items: {
      product: string;
      category: string;
      quantity: number;
      price: number;
      subtotal: number;
    }[];
  }[];
}

/**
 * Export Report Component
 * 
 * Komponen untuk download laporan penjualan dengan filter tanggal.
 * Fitur:
 * - Date range picker (dari - sampai)
 * - Download CSV atau PDF
 * - Loading state
 */
export default function ExportReport() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('pdf');
  const [error, setError] = useState('');

  // Set default dates (last 30 days)
  const setLast30Days = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setStartDate(formatDateForInput(start));
    setEndDate(formatDateForInput(end));
  };

  // Set this month
  const setThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setStartDate(formatDateForInput(start));
    setEndDate(formatDateForInput(end));
  };

  // Set last month
  const setLastMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    
    setStartDate(formatDateForInput(start));
    setEndDate(formatDateForInput(end));
  };

  const handleExport = async () => {
    setIsExporting(true);
    setError('');

    try {
      // Build URL with query params
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('format', 'json'); // Always get JSON, then convert to desired format

      const response = await fetch(`/api/admin/export?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Gagal mengexport laporan');
      }

      const data: ReportData = await response.json();

      if (exportFormat === 'pdf') {
        generatePDF(data);
      } else {
        generateCSV(data);
      }

    } catch (err) {
      console.error('Export error:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsExporting(false);
    }
  };

  // Generate PDF with jsPDF
  const generatePDF = (data: ReportData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header - Title
    doc.setFontSize(20);
    doc.setTextColor(43, 33, 24); // #2B2118
    doc.text('Laporan Penjualan', pageWidth / 2, 20, { align: 'center' });
    
    // Subtitle - Kopi Cerita
    doc.setFontSize(12);
    doc.setTextColor(111, 78, 55); // #6F4E37
    doc.text('Kopi Cerita', pageWidth / 2, 28, { align: 'center' });
    
    // Date range
    doc.setFontSize(10);
    doc.setTextColor(92, 74, 61); // #5C4A3D
    const dateText = `Periode: ${data.summary.dateRange.start} - ${data.summary.dateRange.end}`;
    doc.text(dateText, pageWidth / 2, 36, { align: 'center' });
    
    // Summary Box
    doc.setFillColor(245, 239, 230); // #F5EFE6
    doc.roundedRect(14, 42, pageWidth - 28, 30, 3, 3, 'F');
    
    // Summary content
    doc.setFontSize(10);
    doc.setTextColor(43, 33, 24);
    
    const summaryY = 52;
    const colWidth = (pageWidth - 28) / 3;
    
    // Total Pesanan
    doc.setFont('helvetica', 'normal');
    doc.text('Total Pesanan', 24, summaryY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(data.summary.totalOrders.toString(), 24, summaryY + 8);
    
    // Total Item
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Total Item Terjual', 24 + colWidth, summaryY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(data.summary.totalItems.toString(), 24 + colWidth, summaryY + 8);
    
    // Total Pendapatan
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Total Pendapatan', 24 + colWidth * 2, summaryY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(34, 197, 94); // green
    doc.text(formatCurrency(data.summary.totalRevenue), 24 + colWidth * 2, summaryY + 8);
    
    // Orders Table
    doc.setTextColor(43, 33, 24);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Detail Pesanan', 14, 82);
    
    // Prepare table data
    const tableData: (string | number)[][] = [];
    
    data.orders.forEach(order => {
      order.items.forEach((item, index) => {
        tableData.push([
          index === 0 ? order.id.slice(0, 8) + '...' : '',
          index === 0 ? formatDateDisplay(order.date) : '',
          index === 0 ? order.customer : '',
          index === 0 ? translateStatus(order.status) : '',
          item.product,
          item.quantity,
          formatCurrency(item.price),
          formatCurrency(item.subtotal),
          index === 0 ? formatCurrency(order.total) : '',
        ]);
      });
    });

    autoTable(doc, {
      startY: 86,
      head: [['ID', 'Tanggal', 'Pelanggan', 'Status', 'Produk', 'Qty', 'Harga', 'Subtotal', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [111, 78, 55], // #6F4E37
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 7,
        textColor: [43, 33, 24],
      },
      alternateRowStyles: {
        fillColor: [245, 239, 230], // #F5EFE6
      },
      columnStyles: {
        0: { cellWidth: 18 },
        1: { cellWidth: 20 },
        2: { cellWidth: 25 },
        3: { cellWidth: 18 },
        4: { cellWidth: 30 },
        5: { cellWidth: 12, halign: 'center' },
        6: { cellWidth: 22, halign: 'right' },
        7: { cellWidth: 22, halign: 'right' },
        8: { cellWidth: 22, halign: 'right' },
      },
      margin: { left: 14, right: 14 },
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(139, 115, 85); // #8B7355
      doc.text(
        `Halaman ${i} dari ${pageCount} | Dicetak: ${new Date().toLocaleString('id-ID')}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    // Save PDF
    const filename = generateFilename(startDate, endDate, 'pdf');
    doc.save(filename);
  };

  // Generate CSV
  const generateCSV = (data: ReportData) => {
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

    // Data rows
    data.orders.forEach(order => {
      order.items.forEach((item, index) => {
        csvRows.push([
          index === 0 ? order.id : '',
          index === 0 ? formatDateDisplay(order.date) : '',
          index === 0 ? escapeCSV(order.customer) : '',
          index === 0 ? order.email : '',
          index === 0 ? order.status : '',
          escapeCSV(item.product),
          item.category,
          item.quantity.toString(),
          item.price.toString(),
          item.subtotal.toString(),
          index === 0 ? order.total.toString() : '',
        ].join(','));
      });
    });

    // Summary
    csvRows.push('');
    csvRows.push(`RINGKASAN LAPORAN`);
    csvRows.push(`Periode,${data.summary.dateRange.start} - ${data.summary.dateRange.end}`);
    csvRows.push(`Total Pesanan,${data.summary.totalOrders}`);
    csvRows.push(`Total Item Terjual,${data.summary.totalItems}`);
    csvRows.push(`Total Pendapatan,${data.summary.totalRevenue}`);

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = generateFilename(startDate, endDate, 'csv');
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div 
      className="p-6 rounded-xl shadow-sm"
      style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#6F4E3715', color: '#6F4E37' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold font-[family-name:var(--font-heading)]" style={{ color: '#2B2118' }}>
            Export Laporan
          </h3>
          <p className="text-sm" style={{ color: '#5C4A3D' }}>
            Download laporan penjualan dalam format PDF atau CSV
          </p>
        </div>
      </div>

      {/* Quick Date Presets */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={setLast30Days}
          className="px-3 py-1.5 text-sm rounded-lg transition-colors hover:opacity-80"
          style={{ backgroundColor: '#EBE4D8', color: '#5C4A3D' }}
        >
          30 Hari Terakhir
        </button>
        <button
          type="button"
          onClick={setThisMonth}
          className="px-3 py-1.5 text-sm rounded-lg transition-colors hover:opacity-80"
          style={{ backgroundColor: '#EBE4D8', color: '#5C4A3D' }}
        >
          Bulan Ini
        </button>
        <button
          type="button"
          onClick={setLastMonth}
          className="px-3 py-1.5 text-sm rounded-lg transition-colors hover:opacity-80"
          style={{ backgroundColor: '#EBE4D8', color: '#5C4A3D' }}
        >
          Bulan Lalu
        </button>
      </div>

      {/* Date Range Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#5C4A3D' }}>
            Dari Tanggal
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border outline-none transition-all focus:shadow-md"
            style={{ 
              borderColor: '#E0D6C8', 
              backgroundColor: '#FFFDF9',
              color: '#2B2118',
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#5C4A3D' }}>
            Sampai Tanggal
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border outline-none transition-all focus:shadow-md"
            style={{ 
              borderColor: '#E0D6C8', 
              backgroundColor: '#FFFDF9',
              color: '#2B2118',
            }}
          />
        </div>
      </div>

      {/* Format Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" style={{ color: '#5C4A3D' }}>
          Format Export
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="format"
              value="pdf"
              checked={exportFormat === 'pdf'}
              onChange={() => setExportFormat('pdf')}
              className="w-4 h-4"
              style={{ accentColor: '#6F4E37' }}
            />
            <span className="flex items-center gap-1.5" style={{ color: '#2B2118' }}>
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zm-3 9h-1v4h1a2 2 0 1 0 0-4zm5.5 0H14v4h1v-1.5h.5a1.25 1.25 0 1 0 0-2.5zm-5.5 1a1 1 0 1 1 0 2h-.5v-2h.5z"/>
              </svg>
              PDF
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="format"
              value="csv"
              checked={exportFormat === 'csv'}
              onChange={() => setExportFormat('csv')}
              className="w-4 h-4"
              style={{ accentColor: '#6F4E37' }}
            />
            <span className="flex items-center gap-1.5" style={{ color: '#2B2118' }}>
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm3 4H9v-2h2v2zm0-4H9v-2h2v2zm3 4h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
              </svg>
              CSV
            </span>
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div 
          className="mb-4 p-3 rounded-lg text-sm"
          style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
        >
          {error}
        </div>
      )}

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
      >
        {isExporting ? (
          <>
            <div 
              className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: '#FFFDF9', borderTopColor: 'transparent' }}
            />
            Mengexport...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download {exportFormat.toUpperCase()}
          </>
        )}
      </button>

      {/* Info text */}
      <p className="mt-3 text-xs" style={{ color: '#8B7355' }}>
        * Kosongkan tanggal untuk export semua data
      </p>
    </div>
  );
}

// Helpers
function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatDateDisplay(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
}

function translateStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Menunggu',
    confirmed: 'Dikonfirmasi',
    preparing: 'Diproses',
    ready: 'Siap',
    delivered: 'Selesai',
    cancelled: 'Dibatalkan',
  };
  return statusMap[status] || status;
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function generateFilename(startDate: string | null, endDate: string | null, ext: string): string {
  const timestamp = new Date().toISOString().split('T')[0];
  
  if (startDate && endDate) {
    return `laporan-penjualan_${startDate}_to_${endDate}.${ext}`;
  }
  return `laporan-penjualan_${timestamp}.${ext}`;
}
