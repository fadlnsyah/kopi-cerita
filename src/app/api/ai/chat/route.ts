import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { FALLBACK_ANSWER, sanitizeResponse } from '@/lib/ai/guardrails';
import { generateKopiBotJson } from '@/lib/ai/llm';
import { buildContextPrompt, KOPIBOT_SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { getCouponContext } from '@/lib/ai/coupon-context';
import { getOrderContext } from '@/lib/ai/order-context';
import { getProductContext } from '@/lib/ai/product-context';
import { parseKopiBotResponse } from '@/lib/ai/response-parser';
import { InternalContext, KopiBotIntent, KopiBotResponse } from '@/lib/ai/types';

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 12;

function createSessionId(sessionId: unknown) {
  if (typeof sessionId === 'string' && sessionId.trim().length > 0) {
    return sessionId.trim();
  }

  return crypto.randomUUID();
}

function getRateLimitKey(request: NextRequest, userId?: string) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return userId || forwardedFor || 'anonymous';
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  current.count += 1;
  return false;
}

function detectIntent(message: string): KopiBotIntent {
  const lowerMessage = message.toLowerCase();

  if (/(rekomendasi|manis|strong|best seller|menu|kopi|non-coffee|snack)/i.test(lowerMessage)) {
    return 'product_recommendation';
  }

  if (/(promo|kupon|voucher|diskon)/i.test(lowerMessage)) {
    return 'promo_query';
  }

  if (/(pesanan|order|status|ready|diproses|sampai mana)/i.test(lowerMessage)) {
    return 'order_status';
  }

  if (/(refund|bayar|payment|pengiriman|takeaway|policy|kebijakan)/i.test(lowerMessage)) {
    return 'policy_query';
  }

  return 'general_support';
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

function buildDeterministicResponse(
  message: string,
  sessionId: string,
  context: InternalContext
): KopiBotResponse {
  const intent = detectIntent(message);

  if (intent === 'product_recommendation') {
    const recommendedProducts = context.products.slice(0, 3).map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      reason: product.isPopular
        ? 'Menu ini populer dan cocok jadi pilihan pertama.'
        : 'Menu ini paling relevan dengan pertanyaan kamu.',
      category: product.category,
      hasModifiers: product.hasModifiers,
    }));

    if (recommendedProducts.length === 0) {
      return {
        answer: 'Aku belum menemukan data produk yang bisa direkomendasikan saat ini.',
        intent,
        recommendedProducts: [],
        sources: [],
        needAdmin: true,
        sessionId,
      };
    }

    return {
      answer: `Aku rekomendasikan ${recommendedProducts.map((product) => product.name).join(', ')}. Pilihan ini aku ambil dari menu Kopi Cerita yang tersedia di sistem.`,
      intent,
      recommendedProducts,
      sources: recommendedProducts.map((product) => ({
        type: 'product',
        title: product.name,
      })),
      needAdmin: false,
      sessionId,
    };
  }

  if (intent === 'promo_query') {
    if (context.coupons.length === 0) {
      return {
        answer: 'Saat ini belum ada promo atau kupon aktif yang tercatat di sistem Kopi Cerita.',
        intent,
        recommendedProducts: [],
        sources: [],
        needAdmin: false,
        sessionId,
      };
    }

    const couponText = context.coupons
      .map((coupon) => {
        const minimum = coupon.minPurchase
          ? `minimal belanja ${formatPrice(coupon.minPurchase)}`
          : 'tanpa minimal belanja';
        return `${coupon.code} diskon ${coupon.discount}% (${minimum})`;
      })
      .join(', ');

    return {
      answer: `Promo aktif saat ini: ${couponText}.`,
      intent,
      recommendedProducts: [],
      sources: context.coupons.map((coupon) => ({
        type: 'coupon',
        title: coupon.code,
      })),
      needAdmin: false,
      sessionId,
    };
  }

  if (intent === 'order_status') {
    if (context.orderAuthState === 'unauthenticated') {
      return {
        answer: 'Untuk cek status pesanan, kamu perlu login dulu supaya aku bisa melihat pesanan milikmu dengan aman.',
        intent,
        recommendedProducts: [],
        sources: [],
        needAdmin: false,
        sessionId,
      };
    }

    const latestOrder = context.orders[0];
    if (!latestOrder) {
      return {
        answer: 'Aku belum menemukan pesanan di akun kamu.',
        intent,
        recommendedProducts: [],
        sources: [],
        needAdmin: false,
        sessionId,
      };
    }

    return {
      answer: `Order terakhir kamu saat ini berstatus ${latestOrder.status} dengan total ${formatPrice(latestOrder.total)}. Item pesanan: ${latestOrder.items.join(', ')}.`,
      intent,
      recommendedProducts: [],
      sources: [{ type: 'order', title: 'Order terakhir kamu' }],
      needAdmin: false,
      sessionId,
    };
  }

  if (intent === 'policy_query') {
    return {
      answer: 'Aku belum punya data policy toko yang cukup lengkap untuk menjawab dengan akurat. Silakan hubungi admin Kopi Cerita agar dibantu lebih lanjut.',
      intent,
      recommendedProducts: [],
      sources: [],
      needAdmin: true,
      sessionId,
    };
  }

  return {
    answer: message.length < 12
      ? 'Boleh ceritakan sedikit lebih detail? Aku bisa bantu soal rekomendasi menu, promo, pesanan, refund, dan cara order di Kopi Cerita.'
      : 'Aku bisa bantu soal rekomendasi menu, promo aktif, status pesanan, dan bantuan umum Kopi Cerita. Untuk informasi yang belum ada di sistem, aku akan arahkan ke admin.',
    intent,
    recommendedProducts: [],
    sources: [],
    needAdmin: false,
    sessionId,
  };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = (await request.json()) as {
      message?: unknown;
      sessionId?: unknown;
    };

    if (typeof body.message !== 'string' || body.message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Pesan tidak boleh kosong.' },
        { status: 400 }
      );
    }

    const message = body.message.trim();

    if (message.length > 500) {
      return NextResponse.json(
        { error: 'Pesan terlalu panjang. Maksimal 500 karakter.' },
        { status: 400 }
      );
    }

    const rateLimitKey = getRateLimitKey(request, session?.user?.id);
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { error: 'KopiBot menerima terlalu banyak pesan. Coba lagi sebentar lagi ya.' },
        { status: 429 }
      );
    }

    const sessionId = createSessionId(body.sessionId);
    const [products, coupons, orderContext] = await Promise.all([
      getProductContext(message),
      getCouponContext(),
      getOrderContext(session?.user?.id),
    ]);

    const internalContext: InternalContext = {
      products,
      coupons,
      orders: orderContext.orders,
      orderAuthState: orderContext.orderAuthState,
    };

    let response: KopiBotResponse;

    try {
      const llmContent = await generateKopiBotJson([
        { role: 'system', content: KOPIBOT_SYSTEM_PROMPT },
        { role: 'user', content: buildContextPrompt(internalContext) },
        { role: 'user', content: `Customer message: ${message}` },
      ]);

      response = llmContent
        ? parseKopiBotResponse(llmContent, sessionId)
        : buildDeterministicResponse(message, sessionId, internalContext);
    } catch (error) {
      console.error('KopiBot LLM error:', error);
      response = buildDeterministicResponse(message, sessionId, internalContext);
    }

    return NextResponse.json(sanitizeResponse(response));
  } catch (error) {
    console.error('KopiBot chat error:', error);
    return NextResponse.json(
      { error: FALLBACK_ANSWER },
      { status: 500 }
    );
  }
}
