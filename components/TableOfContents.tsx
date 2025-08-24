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
}

export default function TableOfContents({ className = '', tocItems }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [headerHeight, setHeaderHeight] = useState(100);

  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      setHeaderHeight(header.clientHeight + 24);
    }
  }, []);

  useEffect(() => {
    if (tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: `-${headerHeight}px 0px -80% 0px`,
        threshold: 0
      }
    );

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [tocItems, headerHeight]);

  const scrollToHeading = (id: string) => {
    setActiveId(id);
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
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