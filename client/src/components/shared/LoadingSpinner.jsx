import React from 'react';

export default function LoadingSpinner({ size = 'lg', text = '' }) {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <div className="relative">
        <div className={`${sizes[size]} animate-spin rounded-full border-[3px] border-indigo-500/20 border-t-indigo-500`} />
        <div className={`absolute inset-0 ${sizes[size]} animate-spin rounded-full border-[3px] border-transparent border-b-purple-500/50`}
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      {text && <p className="text-sm text-gray-500 animate-pulse">{text}</p>}
    </div>
  );
}
