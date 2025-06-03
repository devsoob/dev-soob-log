import React from 'react';
import Link from 'next/link';

interface TagProps {
  name: string;
  count?: number;
  className?: string;
  onClick?: () => void;
}

export default function Tag({ name, count, className = '', onClick }: TagProps) {
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors';
  
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${className}`}
      >
        {name}
        {count !== undefined && (
          <span className="ml-2 bg-gray-200 px-2 py-0.5 rounded-full text-xs">
            {count}
          </span>
        )}
      </button>
    );
  }

  return (
    <Link
      href={`/tags/${name}`}
      className={`${baseClasses} ${className}`}
    >
      {name}
      {count !== undefined && (
        <span className="ml-2 bg-gray-200 px-2 py-0.5 rounded-full text-xs">
          {count}
        </span>
      )}
    </Link>
  );
} 