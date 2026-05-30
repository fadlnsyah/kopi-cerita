'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import ChatMessage, { ChatMessageItem } from './ChatMessage';
import { RecommendedProduct } from './ProductRecommendationCard';
import { ChatSource } from './SourceBadge';
import SuggestedQuestions from './SuggestedQuestions';

interface ChatResponse {
  answer: string;
  intent:
    | 'product_recommendation'
    | 'promo_query'
    | 'order_status'
    | 'policy_query'
    | 'general_support'
    | 'unknown';
  recommendedProducts: RecommendedProduct[];
  sources: ChatSource[];
  needAdmin: boolean;
  sessionId: string;
}

function ChatIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 9.5C5 6.46 7.46 4 10.5 4H13.5C16.54 4 19 6.46 19 9.5V10.5C19 13.54 16.54 16 13.5 16H12L8.5 19V16H10.5C7.46 16 5 13.54 5 10.5V9.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 10H9.01M12 10H12.01M15 10H15.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-md border border-[#E0D6C8] bg-[#FFFDF9] px-4 py-3 shadow-sm">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#8B7355]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#8B7355] [animation-delay:120ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#8B7355] [animation-delay:240ms]" />
        </div>
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, isLoading]);

  const sendMessage = async (rawMessage: string) => {
    const message = rawMessage.trim();
    if (!message || isLoading) return;

    const userMessage: ChatMessageItem = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
    };

    setMessages((current) => [...current, userMessage]);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sessionId }),
      });

      const data = (await response.json()) as Partial<ChatResponse> & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || 'KopiBot belum bisa menjawab sekarang.');
      }

      const assistantMessage: ChatMessageItem = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.answer || 'Maaf, KopiBot belum punya jawaban untuk itu.',
        recommendedProducts: data.recommendedProducts || [],
        sources: data.sources || [],
      };

      setMessages((current) => [...current, assistantMessage]);
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }
    } catch (requestError) {
      const fallbackMessage =
        requestError instanceof Error
          ? requestError.message
          : 'Maaf, KopiBot lagi belum bisa menjawab sekarang. Coba lagi sebentar lagi ya.';
      setError(fallbackMessage);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: fallbackMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {isOpen && (
        <section
          aria-label="KopiBot AI chat"
          className="mb-3 flex h-[min(620px,calc(100vh-6.5rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-[#D0C4B4] bg-[#F5EFE6] shadow-2xl sm:w-[390px]"
        >
          <header className="flex items-center justify-between border-b border-[#E0D6C8] bg-[#2B2118] px-4 py-3 text-[#FFFDF9]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6F4E37]">
                <ChatIcon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[#FFFDF9]">
                  KopiBot AI
                </h2>
                <p className="text-xs text-[#E0D6C8]">Asisten Kopi Cerita</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-[#E0D6C8] transition hover:bg-[#3D3027] hover:text-[#FFFDF9]"
              aria-label="Tutup KopiBot AI"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {messages.length === 0 ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-[#E0D6C8] bg-[#FFFDF9] p-4 text-sm text-[#5C4A3D] shadow-sm">
                  Halo, aku KopiBot. Aku bisa bantu rekomendasi menu, cek promo,
                  status pesanan, dan info bantuan Kopi Cerita.
                </div>
                <SuggestedQuestions onSelect={sendMessage} disabled={isLoading} />
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {error && (
            <div className="mx-4 mb-3 rounded-xl border border-[#B85C5C]/30 bg-[#B85C5C]/10 px-3 py-2 text-xs text-[#7A3333]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="border-t border-[#E0D6C8] bg-[#FFFDF9] p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage(input);
                  }
                }}
                maxLength={500}
                rows={1}
                placeholder="Tanya KopiBot..."
                className="max-h-24 min-h-11 flex-1 resize-none rounded-xl border border-[#E0D6C8] bg-[#FFFDF9] px-3 py-2 text-sm text-[#2B2118] outline-none transition placeholder:text-[#A89585] focus:border-[#6F4E37]"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#6F4E37] text-[#FFFDF9] transition hover:bg-[#5A3D2B] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Kirim pesan"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12H19M13 6L19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#6F4E37] text-[#FFFDF9] shadow-xl transition hover:scale-105 hover:bg-[#5A3D2B] focus:outline-none focus:ring-4 focus:ring-[#C9A45C]/40"
        aria-label={isOpen ? 'Tutup KopiBot AI' : 'Buka KopiBot AI'}
      >
        {isOpen ? (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <ChatIcon />
        )}
      </button>
    </div>
  );
}
