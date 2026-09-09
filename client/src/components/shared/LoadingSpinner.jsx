import React from 'react';

export default function LoadingSpinner({ size = 'lg', text = '' }) {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
      <div className={`${sizes[size]} animate-spin rounded-full border-4 border-indigo-100 border-t-primary`} />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
}
