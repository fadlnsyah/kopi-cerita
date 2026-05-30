export type KopiBotIntent =
  | 'product_recommendation'
  | 'promo_query'
  | 'order_status'
  | 'policy_query'
  | 'general_support'
  | 'unknown';

export interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  image: string | null;
  reason: string;
  category?: string;
  hasModifiers?: boolean;
}

export interface KopiBotSource {
  type: 'product' | 'coupon' | 'order' | 'faq' | 'policy' | 'site_setting';
  title: string;
}

export interface KopiBotResponse {
  answer: string;
  intent: KopiBotIntent;
  recommendedProducts: RecommendedProduct[];
  sources: KopiBotSource[];
  needAdmin: boolean;
  sessionId: string;
}

export interface ProductContextItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
  isPopular: boolean;
  isNew: boolean;
  discountPercent: number | null;
  averageRating: number | null;
  reviewCount: number;
  hasModifiers: boolean;
  modifierSummary: string[];
}

export interface CouponContextItem {
  code: string;
  discount: number;
  minPurchase: number | null;
  validUntil: string;
  remainingUses: number | null;
}

export interface OrderContextItem {
  id: string;
  status: string;
  total: number;
  orderType: string;
  createdAt: string;
  items: string[];
}

export interface InternalContext {
  products: ProductContextItem[];
  coupons: CouponContextItem[];
  orders: OrderContextItem[];
  orderAuthState: 'authenticated' | 'unauthenticated';
}
