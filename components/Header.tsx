import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { UnifiedPost } from '@/types/post';
import SearchIcon from './icons/SearchIcon';
import CloseIcon from './icons/CloseIcon';
import RssIcon from './icons/RssIcon';

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
  const [isSearching, setIsSearching] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const router = useRouter();
  const isHomePage = router.pathname === '/';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 480);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const {
    searchTerm,
    setSearchTerm,
    handleSearchSubmit,
    handleClearSearch
  } = useSearch(onSearchResults, (searching) => {
    setIsSearching(searching);
    onSearching?.(searching);
  });

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
    <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-[#1a1a1a]/80 z-[100]" role="banner">
      <div className="w-full flex justify-between items-center px-4 xs:px-8 h-14 xs:h-16">
        <Link href="/" className="text-xl xs:text-2xl font-bold italic hover:scale-105 transition-transform duration-200 text-black dark:text-white" onClick={handleLogoClick} aria-label="Dev Soob Log - Home">
          Dev Soob Log
        </Link>
        <nav className="flex items-center space-x-1 xs:space-x-2">
          {isHomePage && (
            <div className="relative">
              {/* 검색 아이콘 버튼 */}
              {!isSearchVisible && (
                <button
                  onClick={() => {
                    setIsSearchVisible(true);
                    setTimeout(() => {
                      const searchInput = document.getElementById(isMobile ? 'mobile-search' : 'desktop-search');
                      searchInput?.focus();
                    }, 100);
                  }}
                  className="p-1.5 xs:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors duration-200"
                  aria-label="검색창 열기"
                >
                  <SearchIcon className="text-black dark:text-white xs:w-5 xs:h-5" aria-hidden="true" />
                </button>
              )}

              {/* 데스크톱 검색창 */}
              {isSearchVisible && (
                <div className="hidden xs:block">
                  <form onSubmit={handleSearchSubmit} className="relative" role="search">
                    <label htmlFor="desktop-search" className="sr-only">블로그 글 검색</label>
                    <div className="relative">
                      <input
                        id="desktop-search"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-48 xs:w-64 pl-2 pr-8 py-1 text-xs xs:text-sm text-gray-900 dark:text-white border-b border-black dark:border-white focus:outline-none bg-transparent"
                        autoFocus
                        placeholder="검색어를 입력하세요..."
                        aria-label="블로그 글 검색"
                        aria-describedby="search-description"
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            handleClearSearchAndHide();
                          }
                        }}
                      />
                      <div id="search-description" className="sr-only" aria-live="polite">
                        {isSearching ? "검색 중..." : searchTerm.length > 0 ? "검색 결과가 실시간으로 업데이트됩니다." : "검색어를 입력하세요"}
                      </div>
                      <button
                        type="button"
                        onClick={handleClearSearchAndHide}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                        aria-label="검색창 닫기"
                      >
                        <CloseIcon className="xs:w-4 xs:h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* 모바일 검색창 */}
              {isSearchVisible && (
                <div className="block xs:hidden absolute top-full left-0 right-0 px-4 pb-4 bg-white/80 dark:bg-[#1a1a1a]/80">
                  <form onSubmit={handleSearchSubmit} className="relative" role="search">
                    <label htmlFor="mobile-search" className="sr-only">블로그 글 검색</label>
                    <div className="relative">
                      <input
                        id="mobile-search"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-2 pr-8 py-1 text-xs text-gray-900 dark:text-white border-b border-black dark:border-white focus:outline-none bg-transparent"
                        autoFocus
                        placeholder="검색어를 입력하세요..."
                        aria-label="블로그 글 검색"
                        aria-describedby="mobile-search-description"
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            handleClearSearchAndHide();
                          }
                        }}
                      />
                      <div id="mobile-search-description" className="sr-only" aria-live="polite">
                        {isSearching ? "검색 중..." : searchTerm.length > 0 ? "검색 결과가 실시간으로 업데이트됩니다." : "검색어를 입력하세요"}
                      </div>
                      <button
                        type="button"
                        onClick={handleClearSearchAndHide}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                        aria-label="검색창 닫기"
                      >
                        <CloseIcon aria-hidden="true" />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
          <ThemeToggle />
          <Link
            href="/rss.xml"
            className="p-1.5 xs:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors duration-200"
            aria-label="RSS Feed"
            target="_blank"
            rel="noopener noreferrer"
          >
            <RssIcon className="text-black dark:text-white xs:w-5 xs:h-5" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  );
} 