import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 overflow-hidden">
      <div className="h-full bg-blue-500 animate-loading" />
    </div>
  );
} 