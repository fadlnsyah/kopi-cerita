'use client';

import { useState, useCallback } from 'react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  count?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const sizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-6 h-6',
};

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showCount = false,
  count = 0,
  interactive = false,
  onChange,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = hoverRating || rating;
  
  const handleClick = useCallback((star: number) => {
    if (interactive && onChange) {
      onChange(star);
    }
  }, [interactive, onChange]);
  
  const handleMouseEnter = useCallback((star: number) => {
    if (interactive) {
      setHoverRating(star);
    }
  }, [interactive]);
  
  const handleMouseLeave = useCallback(() => {
    if (interactive) {
      setHoverRating(0);
    }
  }, [interactive]);
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, i) => {
          const star = i + 1;
          const filled = star <= displayRating;
          const halfFilled = !filled && star - 0.5 <= displayRating;
          
          return (
            <button
              key={star}
              type="button"
              onClick={() => handleClick(star)}
              onMouseEnter={() => handleMouseEnter(star)}
              onMouseLeave={handleMouseLeave}
              className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
              disabled={!interactive}
            >
              <svg
                className={sizeClasses[size]}
                viewBox="0 0 24 24"
                fill={filled ? '#F59E0B' : halfFilled ? 'url(#halfGrad)' : 'none'}
                stroke={filled || halfFilled ? '#F59E0B' : '#D1D5DB'}
                strokeWidth="1.5"
              >
                <defs>
                  <linearGradient id="halfGrad">
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            </button>
          );
        })}
      </div>
      
      {showCount && count > 0 && (
        <span className="text-sm ml-1" style={{ color: '#8B7355' }}>
          ({count})
        </span>
      )}
      
      {interactive && rating > 0 && (
        <span className="text-sm ml-2 font-medium" style={{ color: '#6F4E37' }}>
          {rating} / {maxRating}
        </span>
      )}
    </div>
  );
}
