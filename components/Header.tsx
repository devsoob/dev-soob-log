import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { SearchResultPost } from '@/types/post';
import SearchIcon from './icons/SearchIcon';
import CloseIcon from './icons/CloseIcon';
import RssIcon from './icons/RssIcon';
import { ROUTES, SEARCH_CONFIG } from '@/lib/constants';
import { debounce } from '@/lib/utils';

interface HeaderProps {
  onSearchResults?: (results: SearchResultPost[] | null) => void;
  onSearching?: (isSearching: boolean) => void;
  onSearchVisible?: (visible: boolean) => void;
}

// 검색 훅
function useSearch(
  onSearchResults?: (results: SearchResultPost[] | null) => void,
  onSearching?: (isSearching: boolean) => void
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = async (term: string) => {
    if (term.length < SEARCH_CONFIG.minSearchLength) {
      onSearchResults?.(null);
      return;
    }
    
    setIsSearching(true);
    onSearching?.(true);
    
    try {
      const response = await fetch(`${ROUTES.api.search}?q=${encodeURIComponent(term)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
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

  // 디바운스된 검색 함수
  const debouncedSearch = debounce(performSearch, SEARCH_CONFIG.debounceDelay);

  useEffect(() => {
    if (searchTerm.length >= SEARCH_CONFIG.minSearchLength) {
      debouncedSearch(searchTerm);
    } else if (searchTerm.length === 0) {
      onSearchResults?.(null);
    }
  }, [searchTerm, debouncedSearch, onSearchResults]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchTerm);
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
  const isHomePage = router.pathname === ROUTES.home;

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
    onSearchVisible?.(isSearchVisible);
  }, [isSearchVisible, onSearchVisible]);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <Link 
              href={ROUTES.home}
              onClick={handleLogoClick}
              className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {isSearchVisible ? '←' : 'Dev Soob Log'}
            </Link>
          </div>

          {/* 검색 및 네비게이션 */}
          <div className="flex items-center space-x-4">
            {/* 검색 버튼 */}
            <button
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="검색"
            >
              <SearchIcon className="w-5 h-5" />
            </button>

            {/* RSS 링크 */}
            <Link
              href="/rss.xml"
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="RSS 피드"
            >
              <RssIcon className="w-5 h-5" />
            </Link>

            {/* 테마 토글 */}
            <ThemeToggle />
          </div>
        </div>

        {/* 검색 바 */}
        {isSearchVisible && (
          <div className="pb-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="포스트 검색..."
                className="w-full px-4 py-2 pl-10 pr-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  aria-label="검색어 지우기"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </header>
  );
} 