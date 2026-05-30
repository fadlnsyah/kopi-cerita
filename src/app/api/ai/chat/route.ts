import { NextRequest, NextResponse } from 'next/server';

type ChatIntent =
  | 'product_recommendation'
  | 'promo_query'
  | 'order_status'
  | 'policy_query'
  | 'general_support'
  | 'unknown';

interface ChatResponse {
  answer: string;
  intent: ChatIntent;
  recommendedProducts: [];
  sources: { type: 'dummy'; title: string }[];
  needAdmin: boolean;
  sessionId: string;
}

function createSessionId(sessionId: unknown) {
  if (typeof sessionId === 'string' && sessionId.trim().length > 0) {
    return sessionId.trim();
  }

  return crypto.randomUUID();
}

function detectIntent(message: string): ChatIntent {
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

function buildDummyAnswer(message: string, intent: ChatIntent) {
  if (intent === 'product_recommendation') {
    return 'Kalau kamu suka kopi yang manis, aku rekomendasikan Kopi Susu Gula Aren. Di Phase berikutnya, aku akan membaca menu asli Kopi Cerita untuk memberi rekomendasi yang lebih akurat.';
  }

  if (intent === 'promo_query') {
    return 'Aku belum tersambung ke data promo aktif. Nanti aku akan cek kupon yang masih berlaku langsung dari sistem Kopi Cerita.';
  }

  if (intent === 'order_status') {
    return 'Untuk cek status pesanan, nanti aku akan memakai akun login kamu dan hanya menampilkan pesanan milikmu. Saat ini fitur status pesanan masih mode demo.';
  }

  if (intent === 'policy_query') {
    return 'Aku belum punya data policy toko yang lengkap. Kalau informasinya belum tersedia, aku akan sarankan kamu menghubungi admin agar jawabannya tetap akurat.';
  }

  if (message.length < 12) {
    return 'Boleh ceritakan sedikit lebih detail? Aku bisa bantu soal rekomendasi menu, promo, pesanan, refund, dan cara order di Kopi Cerita.';
  }

  return 'Aku siap bantu kebutuhan kamu di Kopi Cerita. Untuk saat ini aku masih mode demo, lalu akan ditingkatkan agar bisa membaca data produk, promo, pesanan, FAQ, dan policy toko.';
}

export async function POST(request: NextRequest) {
  try {
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

    const intent = detectIntent(message);
    const response: ChatResponse = {
      answer: buildDummyAnswer(message, intent),
      intent,
      recommendedProducts: [],
      sources: [{ type: 'dummy', title: 'KopiBot AI Phase 1' }],
      needAdmin: intent === 'policy_query',
      sessionId: createSessionId(body.sessionId),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('KopiBot dummy chat error:', error);
    return NextResponse.json(
      { error: 'Maaf, KopiBot lagi belum bisa menjawab sekarang. Coba lagi sebentar lagi ya.' },
      { status: 500 }
    );
  }
}
