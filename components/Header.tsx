import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { UnifiedPost } from '@/types/post';

interface HeaderProps {
  onSearchResults?: (results: UnifiedPost[] | null) => void;
  onSearching?: (isSearching: boolean) => void;
  onSearchVisible?: (visible: boolean) => void;
}

function useSearch(onSearchResults?: (results: UnifiedPost[] | null) => void, onSearching?: (isSearching: boolean) => void) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (searchTerm.length < 1) {
      onSearchResults?.(null);
      return;
    }
    
    setIsSearching(true);
    onSearching?.(true);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      onSearchResults?.(data);
    } catch (error) {
      console.error('Search error:', error);
      onSearchResults?.([]);
    } finally {
      setIsSearching(false);
      onSearching?.(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length >= 1) {
        handleSearch();
      } else if (searchTerm.length === 0) {
        onSearchResults?.(null);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onSearchResults?.(null);
  };

  return {
    searchTerm,
    setSearchTerm,
    isSearching,
    handleSearchSubmit,
    handleClearSearch
  };
}

export default function Header({ onSearchResults, onSearching, onSearchVisible }: HeaderProps) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const router = useRouter();
  const isHomePage = router.pathname === '/';

  const {
    searchTerm,
    setSearchTerm,
    handleSearchSubmit,
    handleClearSearch
  } = useSearch(onSearchResults, onSearching);

  const handleClearSearchAndHide = () => {
    handleClearSearch();
    setIsSearchVisible(false);
  };

  const handleLogoClick = () => {
    if (isSearchVisible) {
      handleClearSearchAndHide();
    }
  };

  useEffect(() => {
    if (onSearchVisible) {
      onSearchVisible(isSearchVisible);
    }
  }, [isSearchVisible]);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-sm z-[100]">
      <div className="w-full flex justify-between items-center px-4 xs:px-8 h-14 xs:h-16">
        <Link href="/" className="text-xl xs:text-2xl font-bold italic hover:scale-105 transition-transform duration-200 text-black dark:text-white" onClick={handleLogoClick}>
          Dev Log&apos;s
        </Link>
        <div className="flex items-center gap-2 xs:gap-4">
          {isHomePage && !isSearchVisible && (
            <button
              onClick={() => setIsSearchVisible(true)}
              className="p-1.5 xs:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors duration-200"
              title="Search"
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
                className="text-black dark:text-white xs:w-5 xs:h-5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          )}
          {isHomePage && isSearchVisible && (
            <form onSubmit={handleSearchSubmit} className="relative hidden xs:block">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 xs:w-64 pl-2 pr-8 py-1 text-xs xs:text-sm text-gray-900 dark:text-white border-b border-black dark:border-white focus:outline-none bg-transparent"
                autoFocus
              />
              <button
                type="button"
                onClick={handleClearSearchAndHide}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="xs:w-4 xs:h-4"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </form>
          )}
          <ThemeToggle />
          <Link
            href="/rss.xml"
            className="p-1.5 xs:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors duration-200"
            title="RSS Feed"
            target="_blank"
            rel="noopener noreferrer"
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
              className="text-black dark:text-white xs:w-5 xs:h-5"
            >
              <path d="M4 11a9 9 0 0 1 9 9" />
              <path d="M4 4a16 16 0 0 1 16 16" />
              <circle cx="5" cy="19" r="1" />
            </svg>
          </Link>
        </div>
        {isHomePage && isSearchVisible && (
          <div className="w-full xs:hidden mt-2 absolute top-full left-0 px-4 pb-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-2 pr-8 py-1 text-xs text-gray-900 dark:text-white border-b border-black dark:border-white focus:outline-none bg-transparent"
                autoFocus
              />
              <button
                type="button"
                onClick={handleClearSearchAndHide}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
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
            </form>
          </div>
        )}
      </div>
    </header>
  );
} 