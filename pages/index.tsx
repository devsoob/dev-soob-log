import { GetStaticProps } from "next";
import { UnifiedPost, SearchResultPost, PaginationInfo } from "@/types/post";
import { getPublishedPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Head from "next/head";
import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { InlineLoader } from "@/components/LoadingSpinner";
import Pagination from "@/components/Pagination";
import { SITE_CONFIG, PAGINATION_CONFIG } from "@/lib/constants";
import { calculatePagination, paginatePosts } from "@/lib/utils";

interface Props {
  posts: UnifiedPost[];
}

export default function Home({ posts }: Props) {
  const [searchResults, setSearchResults] = useState<SearchResultPost[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearchResults = (results: SearchResultPost[] | null) => {
    setSearchResults(results);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const handleSearching = (searching: boolean) => {
    setIsSearching(searching);
  };

  const handleSearchVisible = (visible: boolean) => {
    setIsSearchVisible(visible);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지 변경 시 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 표시할 포스트 결정
  const displayPosts = searchResults !== null ? searchResults : posts;

  // 페이지네이션 계산
  const paginationInfo: PaginationInfo = useMemo(() => {
    return calculatePagination(displayPosts.length, currentPage, PAGINATION_CONFIG.postsPerPage);
  }, [displayPosts.length, currentPage]);

  const paginatedPosts = useMemo(() => {
    if (searchResults !== null) {
      // 검색 결과인 경우 직접 슬라이싱
      const startIndex = (currentPage - 1) * PAGINATION_CONFIG.postsPerPage;
      const endIndex = startIndex + PAGINATION_CONFIG.postsPerPage;
      return displayPosts.slice(startIndex, endIndex);
    } else {
      // 일반 포스트인 경우 유틸리티 함수 사용
      return paginatePosts(displayPosts as UnifiedPost[], currentPage, PAGINATION_CONFIG.postsPerPage);
    }
  }, [displayPosts, currentPage, searchResults]);

  return (
    <>
      <Head>
        <title>{SITE_CONFIG.name}</title>
        <meta name="description" content={SITE_CONFIG.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content={SITE_CONFIG.name} />
        <meta property="og:description" content={SITE_CONFIG.description} />
        <meta property="og:type" content="website" />
      </Head>

      <div className="min-h-screen bg-white dark:bg-[#1a1a1a] flex flex-col">
        <Header 
          onSearchResults={handleSearchResults} 
          onSearching={handleSearching} 
          onSearchVisible={handleSearchVisible} 
        />
        
        <main className="flex-1 max-w-4xl mx-auto px-4 pt-24 pb-8 w-full">
          <section className={`space-y-8 ${isSearchVisible ? 'mt-8 xs:mt-0' : ''}`}>
            {isSearching ? (
              <InlineLoader text="검색 중..." />
            ) : displayPosts.length > 0 ? (
              <>
                {/* 검색 결과 헤더 */}
                {searchResults !== null && (
                  <div className="text-center py-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      검색 결과 ({searchResults.length}개)
                    </h2>
                  </div>
                )}

                {/* 포스트 목록 */}
                <div className="space-y-6">
                  {paginatedPosts.map((post) => (
                    <PostCard 
                      key={post.slug} 
                      post={post as UnifiedPost} 
                      maxDescriptionLength={200}
                    />
                  ))}
                </div>
                
                {/* 페이지네이션 */}
                {paginationInfo.totalPages > 1 && (
                  <Pagination
                    pagination={paginationInfo}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              searchResults !== null && (
                <div className="flex flex-col items-center justify-center py-12 xs:py-16">
                  <span className="text-4xl xs:text-5xl mb-3 xs:mb-4">🤔</span>
                  <p className="text-sm xs:text-base text-gray-600 dark:text-gray-400">
                    검색 결과가 없습니다.
                  </p>
                  <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-500 mt-2">
                    다른 키워드로 검색해보세요.
                  </p>
                </div>
              )
            )}
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const posts = await getPublishedPosts();
    
    return {
      props: {
        posts,
      },
      revalidate: 60, // 1분마다 재생성
    };
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return {
      props: {
        posts: [],
      },
      revalidate: 60,
    };
  }
};
