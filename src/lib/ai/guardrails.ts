import { KopiBotResponse } from './types';

export const FALLBACK_ANSWER =
  'Maaf, aku belum punya informasi yang cukup untuk menjawab pertanyaan itu. Kamu bisa hubungi admin Kopi Cerita agar dibantu lebih lanjut.';

export function clampAnswer(answer: unknown) {
  if (typeof answer !== 'string') return FALLBACK_ANSWER;

  const trimmed = answer.trim();
  if (!trimmed) return FALLBACK_ANSWER;

  return trimmed.length > 900 ? `${trimmed.slice(0, 897)}...` : trimmed;
}

export function sanitizeResponse(response: KopiBotResponse): KopiBotResponse {
  return {
    ...response,
    answer: clampAnswer(response.answer),
    recommendedProducts: response.recommendedProducts.slice(0, 3).map((product) => ({
      id: String(product.id),
      name: String(product.name),
      price: Number.isFinite(product.price) ? product.price : 0,
      image: product.image || null,
      reason: product.reason || 'Cocok dengan preferensi yang kamu sebutkan.',
      category: product.category,
      hasModifiers: product.hasModifiers,
    })),
    sources: response.sources.slice(0, 6).map((source) => ({
      type: source.type,
      title: String(source.title),
    })),
    needAdmin: Boolean(response.needAdmin),
  };
}
