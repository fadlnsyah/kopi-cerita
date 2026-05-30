'use client';

import ProductRecommendationCard, {
  RecommendedProduct,
} from './ProductRecommendationCard';
import SourceBadge, { ChatSource } from './SourceBadge';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessageItem {
  id: string;
  role: ChatRole;
  content: string;
  recommendedProducts?: RecommendedProduct[];
  sources?: ChatSource[];
}

export default function ChatMessage({ message }: { message: ChatMessageItem }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[86%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
            isUser
              ? 'rounded-br-md bg-[#6F4E37] text-[#FFFDF9]'
              : 'rounded-bl-md border border-[#E0D6C8] bg-[#FFFDF9] text-[#2B2118]'
          }`}
        >
          {message.content}
        </div>

        {!isUser && message.recommendedProducts && message.recommendedProducts.length > 0 && (
          <div>
            {message.recommendedProducts.map((product) => (
              <ProductRecommendationCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.sources.map((source, index) => (
              <SourceBadge
                key={`${source.type}-${source.title}-${index}`}
                source={source}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
