'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import StarRating from './StarRating';
import { useToast } from '@/context/ToastContext';

interface ReviewFormProps {
  productId: string;
  productName: string;
  orderId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({ 
  productId, 
  productName, 
  orderId, 
  onSuccess, 
  onCancel 
}: ReviewFormProps) {
  const { data: session } = useSession();
  const { success, error: showError } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      showError('Pilih rating terlebih dahulu');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          orderId,
          rating,
          comment: comment.trim() || null,
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim review');
      }
      
      success('Review berhasil dikirim!');
      onSuccess?.();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!session) {
    return (
      <div className="text-center py-4">
        <p style={{ color: '#5C4A3D' }}>Login untuk memberikan review</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="font-medium mb-2" style={{ color: '#2B2118' }}>
          Review untuk <strong>{productName}</strong>
        </p>
      </div>
      
      {/* Rating */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#5C4A3D' }}>
          Rating *
        </label>
        <StarRating 
          rating={rating} 
          size="lg" 
          interactive 
          onChange={setRating} 
        />
      </div>
      
      {/* Comment */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#5C4A3D' }}>
          Komentar (Opsional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Ceritakan pengalamanmu..."
          className="w-full px-4 py-3 rounded-xl border outline-none resize-none transition-all focus:shadow-md"
          style={{ borderColor: '#E0D6C8', backgroundColor: '#FFFDF9', color: '#2B2118' }}
        />
        <p className="text-xs text-right mt-1" style={{ color: '#8B7355' }}>
          {comment.length}/500
        </p>
      </div>
      
      {/* Buttons */}
      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 font-medium rounded-xl border transition-colors"
            style={{ borderColor: '#E0D6C8', color: '#5C4A3D' }}
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="flex-1 py-3 font-semibold rounded-xl transition-all hover:shadow-md disabled:opacity-50"
          style={{ backgroundColor: '#6F4E37', color: '#FFFDF9' }}
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Review'}
        </button>
      </div>
    </form>
  );
}
