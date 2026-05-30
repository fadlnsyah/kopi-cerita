'use client';

export interface ChatSource {
  type: 'product' | 'coupon' | 'order' | 'faq' | 'policy' | 'site_setting' | 'dummy';
  title: string;
}

const sourceLabels: Record<ChatSource['type'], string> = {
  product: 'Produk',
  coupon: 'Promo',
  order: 'Pesanan',
  faq: 'FAQ',
  policy: 'Policy',
  site_setting: 'Info Toko',
  dummy: 'Demo',
};

export default function SourceBadge({ source }: { source: ChatSource }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#E0D6C8] bg-[#FFFDF9] px-2 py-1 text-[11px] font-medium text-[#5C4A3D]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#7A8450]" />
      {sourceLabels[source.type]}: {source.title}
    </span>
  );
}
