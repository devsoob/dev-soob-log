'use client';

import { useEffect, useState } from 'react';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
  tocItems: TocItem[];
  activeId?: string;
  onHeadingClick?: (id: string) => void;
}

export default function TableOfContents({ 
  className = '', 
  tocItems, 
  activeId: propActiveId, 
  onHeadingClick 
}: TableOfContentsProps) {
  // props로 받은 activeId를 우선 사용, 없으면 내부 상태 사용
  const activeId = propActiveId !== undefined ? propActiveId : '';

  const scrollToHeading = (id: string) => {
    if (onHeadingClick) {
      onHeadingClick(id);
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <nav className={`max-h-[calc(100vh-6rem)] overflow-y-auto ${className}`} aria-label="Table of contents">
      <ul className="space-y-2" role="list">
        {tocItems.map((item) => (
          <li key={item.id} role="listitem">
            <button
              onClick={() => scrollToHeading(item.id)}
              className={`text-left w-full whitespace-normal break-words px-2 py-1 rounded text-sm transition-colors duration-200 hover:bg-tertiary ${
                activeId === item.id
                  ? 'text-link font-medium bg-accent'
                  : 'text-secondary hover:text-primary'
              }`}
              style={{
                paddingLeft: `${(item.level - 1) * 12 + 8}px`
              }}
              aria-current={activeId === item.id ? 'true' : undefined}
              aria-label={`Jump to section: ${item.text}`}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
} 