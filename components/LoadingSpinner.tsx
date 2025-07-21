import React from 'react';

interface LoadingSpinnerProps {
  type?: 'page' | 'search';
}

export default function LoadingSpinner({ type = 'page' }: LoadingSpinnerProps) {
  if (type === 'search') {
    return (
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-black dark:border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 overflow-hidden">
      <div className="h-full bg-blue-500 animate-loading" />
    </div>
  );
} 