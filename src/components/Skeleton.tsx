'use client';

/**
 * Skeleton Components - Loading Placeholder
 * 
 * Komponen skeleton untuk menampilkan placeholder saat data sedang loading
 * Menggunakan animasi pulse untuk efek shimmer
 */

interface SkeletonProps {
  className?: string;
}

// Base Skeleton component
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse rounded ${className}`}
      style={{ backgroundColor: '#E0D6C8' }}
    />
  );
}

// Skeleton untuk ProductCard
export function ProductCardSkeleton() {
  return (
    <div 
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
    >
      {/* Image placeholder */}
      <div className="aspect-square" style={{ backgroundColor: '#EBE4D8' }}>
        <Skeleton className="w-full h-full rounded-none" />
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />
        
        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        {/* Price and Button */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Grid of ProductCard skeletons
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Skeleton untuk Order Card
export function OrderCardSkeleton() {
  return (
    <div 
      className="rounded-xl p-5"
      style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="text-right flex items-center gap-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

// List of Order skeletons
export function OrderListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Skeleton untuk Stats Card di Admin Dashboard
export function StatsCardSkeleton() {
  return (
    <div 
      className="p-6 rounded-xl"
      style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
    >
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}

// Grid of Stats skeletons
export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Skeleton untuk Table Row
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr style={{ borderBottom: '1px solid #EBE4D8' }}>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-6">
          <Skeleton className="h-5 w-full" />
        </td>
      ))}
    </tr>
  );
}

// Skeleton untuk Chart
export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div 
      className="rounded-xl p-6"
      style={{ backgroundColor: '#FFFDF9', border: '1px solid #E0D6C8' }}
    >
      <Skeleton className="h-6 w-40 mb-4" />
      <div 
        className="animate-pulse rounded-lg" 
        style={{ backgroundColor: '#E0D6C8', height }}
      />
    </div>
  );
}

// Text Skeleton
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} 
        />
      ))}
    </div>
  );
}
