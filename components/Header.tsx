import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Header() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (searchTerm.length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    } else if (searchTerm.length === 0 && isSearchVisible) {
      setIsSearchVisible(false);
    }
  }, [searchTerm, router]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-black z-50 border-b border-black/10 dark:border-white/10">
      <div className="w-full h-14 flex justify-between items-center px-5">
        <Link href="/" className="text-lg font-medium text-black dark:text-white">
          Dev Log
        </Link>
        <div className="flex items-center gap-4">
          {isSearchVisible ? (
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="검색어를 입력하세요 (2글자 이상)..."
                className="w-64 px-4 py-1 text-sm text-gray-900 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                autoFocus
              />
              {searchTerm.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </form>
          ) : (
            <button
              onClick={() => setIsSearchVisible(true)}
              className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
              title="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          )}
          <ThemeToggle />
          <Link
            href="/rss.xml"
            className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
            title="RSS Feed"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 11a9 9 0 0 1 9 9" />
              <path d="M4 4a16 16 0 0 1 16 16" />
              <circle cx="5" cy="19" r="1" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
} 