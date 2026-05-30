import { FALLBACK_ANSWER, sanitizeResponse } from './guardrails';
import { KopiBotIntent, KopiBotResponse, KopiBotSource, RecommendedProduct } from './types';

const intents: KopiBotIntent[] = [
  'product_recommendation',
  'promo_query',
  'order_status',
  'policy_query',
  'general_support',
  'unknown',
];

const sourceTypes: KopiBotSource['type'][] = [
  'product',
  'coupon',
  'order',
  'faq',
  'policy',
  'site_setting',
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseProducts(value: unknown): RecommendedProduct[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(isRecord)
    .map((item) => ({
      id: typeof item.id === 'string' ? item.id : '',
      name: typeof item.name === 'string' ? item.name : '',
      price: typeof item.price === 'number' ? item.price : 0,
      image: typeof item.image === 'string' ? item.image : null,
      reason: typeof item.reason === 'string' ? item.reason : '',
      category: typeof item.category === 'string' ? item.category : undefined,
      hasModifiers: typeof item.hasModifiers === 'boolean' ? item.hasModifiers : undefined,
    }))
    .filter((item) => item.id && item.name);
}

function parseSources(value: unknown): KopiBotSource[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(isRecord)
    .map((item) => {
      const type = sourceTypes.includes(item.type as KopiBotSource['type'])
        ? item.type as KopiBotSource['type']
        : null;

      return {
        type,
        title: typeof item.title === 'string' ? item.title : '',
      };
    })
    .filter((item): item is KopiBotSource => Boolean(item.type && item.title));
}

export function parseKopiBotResponse(content: string, sessionId: string): KopiBotResponse {
  try {
    const parsed = JSON.parse(content) as unknown;
    if (!isRecord(parsed)) {
      throw new Error('LLM response is not an object');
    }

    const intent = intents.includes(parsed.intent as KopiBotIntent)
      ? parsed.intent as KopiBotIntent
      : 'unknown';

    return sanitizeResponse({
      answer: typeof parsed.answer === 'string' ? parsed.answer : FALLBACK_ANSWER,
      intent,
      recommendedProducts: parseProducts(parsed.recommendedProducts),
      sources: parseSources(parsed.sources),
      needAdmin: Boolean(parsed.needAdmin),
      sessionId,
    });
  } catch (error) {
    console.error('KopiBot response parse error:', error);
    return {
      answer: FALLBACK_ANSWER,
      intent: 'unknown',
      recommendedProducts: [],
      sources: [],
      needAdmin: true,
      sessionId,
    };
  }
}
