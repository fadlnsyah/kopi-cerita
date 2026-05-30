import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ProductContextItem } from './types';

function getEffectivePrice(price: number, discountPercent: number | null) {
  if (discountPercent && discountPercent > 0) {
    return Math.round(price * (1 - discountPercent / 100));
  }

  return price;
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter((token) => token.length >= 3);
}

function summarizeModifierOptions(options: Prisma.JsonValue) {
  if (!Array.isArray(options)) return [];

  return options
    .map((option) => {
      if (!option || typeof option !== 'object' || Array.isArray(option)) return null;
      const label = (option as Record<string, unknown>).label;
      return typeof label === 'string' ? label : null;
    })
    .filter((label): label is string => Boolean(label))
    .slice(0, 4);
}

function scoreProduct(product: {
  name: string;
  description: string;
  category: string;
  isPopular: boolean;
  isNew: boolean;
  discountPercent: number | null;
  averageRating: number | null;
  reviewCount: number;
}, queryTokens: string[]) {
  const haystack = `${product.name} ${product.description} ${product.category}`.toLowerCase();
  const relevance = queryTokens.reduce(
    (score, token) => score + (haystack.includes(token) ? 8 : 0),
    0
  );

  return (
    relevance +
    (product.isPopular ? 7 : 0) +
    (product.isNew ? 4 : 0) +
    (product.discountPercent ? 3 : 0) +
    (product.averageRating ? product.averageRating : 0) +
    Math.min(product.reviewCount, 20) / 5
  );
}

export async function getProductContext(message: string): Promise<ProductContextItem[]> {
  const queryTokens = tokenize(message);
  const products = await prisma.product.findMany({
    include: {
      modifiers: {
        orderBy: { sortOrder: 'asc' },
        select: {
          name: true,
          required: true,
          options: true,
        },
      },
    },
    orderBy: [
      { isPopular: 'desc' },
      { isNew: 'desc' },
      { averageRating: 'desc' },
      { createdAt: 'desc' },
    ],
    take: 30,
  });

  return products
    .sort((a, b) => scoreProduct(b, queryTokens) - scoreProduct(a, queryTokens))
    .slice(0, 12)
    .map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: getEffectivePrice(product.price, product.discountPercent),
      category: product.category,
      image: product.image,
      isPopular: product.isPopular,
      isNew: product.isNew,
      discountPercent: product.discountPercent,
      averageRating: product.averageRating,
      reviewCount: product.reviewCount,
      hasModifiers: product.modifiers.length > 0,
      modifierSummary: product.modifiers.map((modifier) => {
        const options = summarizeModifierOptions(modifier.options);
        return `${modifier.name}${modifier.required ? ' wajib' : ''}: ${options.join(', ')}`;
      }),
    }));
}

export function formatProductContext(products: ProductContextItem[]) {
  if (products.length === 0) return 'Tidak ada data produk yang tersedia.';

  return products
    .map((product) => {
      const tags = [
        product.category,
        product.isPopular ? 'popular' : null,
        product.isNew ? 'baru' : null,
        product.discountPercent ? `diskon ${product.discountPercent}%` : null,
        product.averageRating ? `rating ${product.averageRating}/5 dari ${product.reviewCount} review` : null,
      ]
        .filter(Boolean)
        .join(', ');

      const modifiers = product.modifierSummary.length
        ? ` Modifier: ${product.modifierSummary.join(' | ')}.`
        : '';

      return `- ${product.name} | id:${product.id} | harga:${product.price} | ${tags}. Deskripsi: ${product.description}.${modifiers}`;
    })
    .join('\n');
}
