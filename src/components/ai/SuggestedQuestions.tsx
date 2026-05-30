'use client';

const suggestedQuestions = [
  'Rekomendasi kopi yang manis dong',
  'Ada promo hari ini?',
  'Menu non-coffee apa saja?',
  'Pesanan saya sudah sampai mana?',
  'Bagaimana cara refund?',
  'Menu best seller apa?',
];

export default function SuggestedQuestions({
  onSelect,
  disabled = false,
}: {
  onSelect: (question: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#8B7355]">
        Pertanyaan cepat
      </p>
      <div className="grid gap-2">
        {suggestedQuestions.map((question) => (
          <button
            key={question}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(question)}
            className="rounded-xl border border-[#E0D6C8] bg-[#FFFDF9] px-3 py-2 text-left text-sm text-[#2B2118] transition hover:border-[#6F4E37] hover:bg-[#F5EFE6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
