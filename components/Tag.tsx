import React from 'react';
import Link from 'next/link';

interface TagProps {
  name: string;
  count?: number;
  className?: string;
  onClick?: () => void;
}

export default function Tag({ name, count, className = '', onClick }: TagProps) {
  const baseClasses = 'inline-flex items-center px-2 py-1 rounded-md text-sm bg-white dark:bg-black border border-black dark:border-white text-black dark:text-white';
  
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${className}`}
      >
        {name}
        {count !== undefined && (
          <span className="ml-2 bg-gray-800 dark:bg-gray-200 px-2 py-0.5 rounded-full text-xs">
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
        <span className="ml-2 bg-gray-800 dark:bg-gray-200 px-2 py-0.5 rounded-full text-xs">
          {count}
        </span>
      )}
    </Link>
  );
} 