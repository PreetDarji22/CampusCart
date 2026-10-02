import React from 'react';

export const CampusCartLogo = ({ size = 36, className = '', showText = false, textClassName = '' }) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* SVG Icon */}
      <div 
        style={{ width: size, height: size }} 
        className="relative flex-shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-teal-400 p-1.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300"
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Graduation Cap Top */}
          <path d="M 50 16 L 82 32 L 50 48 L 18 32 Z" fill="#FFFFFF" />
          <path d="M 50 20 L 76 32 L 50 44 L 24 32 Z" fill="#4F46E5" />
          
          {/* Cap Base */}
          <path d="M 32 40 L 32 52 C 32 60 68 60 68 52 L 68 40 Z" fill="#FFFFFF" opacity="0.9" />
          
          {/* Tassel */}
          <path d="M 50 32 Q 80 34 82 46 L 82 56" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="82" cy="58" r="3.5" fill="#FACC15" />

          {/* Cart Basket */}
          <path d="M 28 54 L 72 54 L 66 76 C 65 79 62 82 58 82 L 40 82 C 36 82 33 79 32 76 Z" fill="#FFFFFF" />
          <path d="M 31 57 L 69 57 L 64 74 C 63 76 61 78 58 78 L 40 78 C 37 78 35 76 34 74 Z" fill="#4F46E5" />

          {/* Cart Lines */}
          <line x1="42" y1="60" x2="44" y2="76" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          <line x1="50" y1="60" x2="50" y2="76" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          <line x1="58" y1="60" x2="56" y2="76" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.85" />

          {/* Cart Wheels */}
          <circle cx="41" cy="87" r="4.5" fill="#FFFFFF" />
          <circle cx="41" cy="87" r="2.5" fill="#10B981" />
          <circle cx="59" cy="87" r="4.5" fill="#FFFFFF" />
          <circle cx="59" cy="87" r="2.5" fill="#10B981" />
        </svg>
      </div>

      {showText && (
        <span className={`font-display font-extrabold tracking-tight text-primary dark:text-white ${textClassName}`}>
          Campus<span className="text-vibrant-indigo dark:text-indigo-400">Cart</span>
        </span>
      )}
    </div>
  );
};
