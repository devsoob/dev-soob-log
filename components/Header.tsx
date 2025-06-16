import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { UnifiedPost } from '@/types/post';

interface HeaderProps {
  onSearchResults?: (results: UnifiedPost[] | null) => void;
  onSearching?: (isSearching: boolean) => void;
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

export default function Header({ onSearchResults, onSearching }: HeaderProps) {
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

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-[100]">
      <div className="w-full h-16 flex justify-between items-center px-8">
        <Link href="/" className="text-lg font-medium text-black dark:text-white" onClick={handleLogoClick}>
          Dev Log
        </Link>
        <div className="flex items-center gap-4">
          {isHomePage && (
            isSearchVisible ? (
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-2 pr-8 py-1 text-sm text-gray-900 bg-white/50 dark:bg-black/50 border-b border-black dark:border-white focus:outline-none dark:text-white backdrop-blur-sm"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleClearSearchAndHide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
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
              </form>
            ) : (
              <button
                onClick={() => setIsSearchVisible(true)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
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
                  className="text-black dark:text-white"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>
            )
          )}
          <ThemeToggle />
          <Link
            href="/rss.xml"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
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
              className="text-black dark:text-white"
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