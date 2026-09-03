import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center space-x-2 p-2">
      <div className="w-1.5 h-1.5 bg-[var(--olive-primary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-1.5 h-1.5 bg-[var(--olive-primary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-1.5 h-1.5 bg-[var(--olive-primary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  );
}
