import { useState, useEffect, useMemo, useRef } from 'react';
import { UnifiedPost } from '@/types/post';
import SearchIcon from '@/components/icons/SearchIcon';
import PostCard from '@/components/PostCard';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
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
  const abortRef = useRef<AbortController | null>(null);
  
  const currentPage = Number(router.query.page) || 1;
  const POSTS_PER_PAGE = 6;

  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  const handleSearch = async (term: string) => {
    // 검색어가 없을 때는 검색하지 않음
    if (!term || term.trim().length === 0) {
      setSearchResults(null);
      setHasSearched(false);
      return;
    }

    // 이전 요청 취소
    if (abortRef.current) {
      abortRef.current.abort();
    }

    setIsSearching(true);
    setHasSearched(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(term.trim())}`,
        { signal: controller.signal, headers: { 'Accept': 'application/json' } });
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(data);
    } catch (error: any) {
      if (error?.name !== 'AbortError') {
        console.error('Search error:', error);
        setSearchResults([]);
      }
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
      <NextSeo
        title="검색 - Dev Soob Log"
        description="Dev Soob Log 블로그에서 프로그래밍, 웹 개발, 백엔드, 프론트엔드 등 다양한 기술 관련 글을 검색하세요."
        canonical={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-soob-log.vercel.app'}/search`}
        openGraph={{
          title: "검색 - Dev Soob Log",
          description: "Dev Soob Log 블로그에서 프로그래밍, 웹 개발, 백엔드, 프론트엔드 등 다양한 기술 관련 글을 검색하세요.",
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-soob-log.vercel.app'}/search`,
          type: 'website',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: '검색, 블로그 검색, 개발 블로그, 프로그래밍, 웹 개발',
          },
        ]}
      />
      <div className="min-h-screen bg-white dark:bg-[#1a1a1a]">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 pt-20 pb-8 w-full">
          {/* 상단 네비게이션 */}
          <div className="mb-8 flex items-center">
            <button
              onClick={() => router.push('/')}
              className="text-tertiary hover:text-secondary flex items-center"
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
                className="block w-full pl-10 pr-3 py-3 bg-secondary border border-primary rounded-lg text-primary placeholder-tertiary focus:outline-none focus:border-secondary transition-colors duration-200"
                placeholder="검색어를 입력하세요..."
                aria-label="검색어 입력"
                autoFocus
              />
            </div>
          </div>

          {/* 검색 중 상태 - 스켈레톤 (PostCard 레이아웃 매칭) */}
          {isSearching && (
            <div className="space-y-8" aria-busy="true" aria-live="polite">
              {[...Array(6)].map((_, idx) => (
                <article key={idx} className="border-b border-gray-200 dark:border-gray-800 last:border-0 pb-8 last:pb-0">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 animate-pulse">
                    <div className="relative h-40 sm:h-64 md:h-full md:col-span-4 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800" />
                    <div className="md:col-span-8">
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 md:mb-3" />
                      <div className="h-7 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2 md:mb-3" />
                      <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                      <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* 검색 완료 상태 */}
          {!isSearching && hasSearched && searchResults && (
            <>
              {searchResults.length > 0 ? (
                <>
                  <div className="mb-6 text-sm text-tertiary">
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
                        maxVisiblePages={5}
                        enableFirstLastNav
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <p className="text-tertiary mb-4">
                    '{searchTerm}'에 대한 검색 결과가 없습니다.
                  </p>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setHasSearched(false);
                      }}
                      className="text-link hover:text-link-hover font-medium"
                    >
                      다시 검색하기
                    </button>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <button
                      onClick={() => router.push('/')}
                      className="text-link hover:text-link-hover font-medium"
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
              <p className="text-tertiary mb-8">
                제목, 설명, 태그로 검색할 수 있습니다.
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
} 