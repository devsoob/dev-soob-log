import { useState, useEffect, useMemo } from 'react';
import { UnifiedPost } from '@/types/post';
import SearchIcon from '@/components/icons/SearchIcon';
import PostCard from '@/components/PostCard';
import Head from 'next/head';
import Pagination from '@/components/Pagination';
import { useRouter } from 'next/router';
import { useDebounce } from '@/hooks/useDebounce';
import Header from '@/components/Header';

export default function SearchPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UnifiedPost[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  const currentPage = Number(router.query.page) || 1;
  const POSTS_PER_PAGE = 5;

  const handleSearch = async (term: string) => {
    // 검색어가 없을 때는 검색하지 않음
    if (!term || term.trim().length === 0) {
      setSearchResults(null);
      setHasSearched(false);
      return;
    }
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(term.trim())}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (debouncedSearchTerm !== undefined) {
      router.push({ query: { ...router.query, page: 1 } }, undefined, { shallow: true });
      handleSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const paginatedResults = useMemo(() => {
    if (!searchResults) return [];
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return searchResults.slice(startIndex, endIndex);
  }, [searchResults, currentPage]);

  const totalPages = searchResults ? Math.ceil(searchResults.length / POSTS_PER_PAGE) : 0;

  const handlePageChange = (page: number) => {
    router.push({ query: { ...router.query, page } }, undefined, { shallow: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>검색 - Dev Soob Log</title>
        <meta name="description" content="Dev Soob Log 블로그 글 검색" />
      </Head>
      <div className="min-h-screen bg-white dark:bg-[#1a1a1a]">
        <Header />
        <main className="pt-24 pb-10">
          <div className="max-w-3xl mx-auto px-4">
            {/* 상단 네비게이션 */}
            <div className="mb-8 flex items-center">
              <button
                onClick={() => router.push('/')}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                전체 글 목록
              </button>
            </div>

            <div className="mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-[#262626] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-colors duration-200"
                  placeholder="검색어를 입력하세요..."
                  aria-label="검색어 입력"
                  autoFocus
                />
              </div>
            </div>

            {/* 검색 중 상태 */}
            {isSearching && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 dark:border-white mb-4"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  '{searchTerm}' 검색 중...
                </p>
              </div>
            )}

            {/* 검색 완료 상태 */}
            {!isSearching && hasSearched && searchResults && (
              <>
                {searchResults.length > 0 ? (
                  <>
                    <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                      '{searchTerm}' 검색 결과 {searchResults.length}개
                    </div>
                    <div className="space-y-8">
                      {paginatedResults.map((post) => (
                        <PostCard key={post.slug} post={post} />
                      ))}
                    </div>
                    {totalPages > 1 && (
                      <div className="mt-12">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      '{searchTerm}'에 대한 검색 결과가 없습니다.
                    </p>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setHasSearched(false);
                        }}
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        다시 검색하기
                      </button>
                      <span className="text-gray-300 dark:text-gray-600">|</span>
                      <button
                        onClick={() => router.push('/')}
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        전체 글 보기
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 검색 결과가 없고 검색 중이 아닐 때 최근 글 표시 */}
            {!isSearching && !hasSearched && (
              <div className="mt-12 text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                  제목, 설명, 태그로 검색할 수 있습니다.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
} 