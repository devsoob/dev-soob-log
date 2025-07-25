'use client';

import { useState, useEffect } from 'react';
import { TocItem } from './TableOfContents';

interface MobileTableOfContentsProps {
  tocItems: TocItem[];
}

export default function MobileTableOfContents({ tocItems }: MobileTableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

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
        rootMargin: '-20% 0px -35% 0px',
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
  }, [tocItems]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      setIsOpen(false);
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <>
      {/* 모바일 목차 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
        aria-label="Open table of contents"
        aria-expanded={isOpen}
        aria-controls="mobile-toc-modal"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>

      {/* 모바일 목차 모달 */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end"
          role="dialog"
          aria-modal="true"
          id="mobile-toc-modal"
          aria-labelledby="mobile-toc-title"
        >
          <div 
            className="bg-white dark:bg-[#1a1a1a] w-full max-h-[80vh] rounded-t-lg shadow-lg"
            role="document"
          >
            <div className="flex items-center justify-between p-4">
              <h2 id="mobile-toc-title" className="text-lg font-semibold text-black dark:text-white">
                Table of Contents
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Close table of contents"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <hr className="mx-4 border-gray-200 dark:border-gray-700" role="separator" />
            <nav className="overflow-y-auto max-h-[calc(80vh-76px)] p-4" aria-label="Table of contents navigation">
              <ul className="space-y-2" role="list">
                {tocItems.map((item) => (
                  <li key={item.id} role="listitem">
                    <button
                      onClick={() => scrollToHeading(item.id)}
                      className={`text-left w-full px-2 py-2 rounded text-sm transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        activeId === item.id
                          ? 'text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
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
          </div>
        </div>
      )}
    </>
  );
} 