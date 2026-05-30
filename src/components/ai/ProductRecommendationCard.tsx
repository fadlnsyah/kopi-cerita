'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CoffeeCupIcon } from '@/components/Icons';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  image: string | null;
  reason: string;
  category?: string;
  hasModifiers?: boolean;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

export default function ProductRecommendationCard({
  product,
}: {
  product: RecommendedProduct;
}) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { success } = useToast();

  const handleAddToCart = async () => {
    if (product.hasModifiers) {
      router.push(`/product/${product.id}`);
      return;
    }

    const added = await addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category || 'recommendation',
    });

    if (added) {
      success(`${product.name} ditambahkan ke keranjang`);
    }
  };

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-[#E0D6C8] bg-[#FFFDF9]">
      <div className="flex gap-3 p-3">
        <Link
          href={`/product/${product.id}`}
          className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#EBE4D8]"
        >
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <CoffeeCupIcon className="h-8 w-8 opacity-50" color="#6F4E37" />
          )}
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href={`/product/${product.id}`}
            className="line-clamp-1 text-sm font-semibold text-[#2B2118] hover:text-[#6F4E37]"
          >
            {product.name}
          </Link>
          <p className="text-sm font-semibold text-[#6F4E37]">
            {formatPrice(product.price)}
          </p>
          <p className="mt-1 line-clamp-2 text-xs text-[#5C4A3D]">
            {product.reason}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 border-t border-[#E0D6C8]">
        <Link
          href={`/product/${product.id}`}
          className="px-3 py-2 text-center text-xs font-semibold text-[#6F4E37] hover:bg-[#F5EFE6]"
        >
          Lihat Detail
        </Link>
        <button
          type="button"
          onClick={handleAddToCart}
          className="border-l border-[#E0D6C8] px-3 py-2 text-xs font-semibold text-[#FFFDF9] transition hover:opacity-90"
          style={{ backgroundColor: '#6F4E37' }}
        >
          {product.hasModifiers ? 'Pilih Opsi' : 'Tambah'}
        </button>
      </div>
    </div>
  );
}
