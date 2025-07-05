import { GetStaticProps } from "next";
import { UnifiedPost } from "@/types/post";
import { getPublishedPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Head from "next/head";
import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import Pagination from "@/components/Pagination";

interface Props {
  posts: UnifiedPost[];
}

export default function Home({ posts }: Props) {
  const [searchResults, setSearchResults] = useState<UnifiedPost[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const POSTS_PER_PAGE = 5; // 페이지당 포스트 수

  const handleSearchResults = (results: UnifiedPost[] | null) => {
    setSearchResults(results);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  const handleSearching = (searching: boolean) => {
    setIsSearching(searching);
  };

  // 검색바 표시 상태를 Header에서 받아오기 위한 핸들러
  const handleSearchVisible = (visible: boolean) => {
    setIsSearchVisible(visible);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지 변경 시 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 표시할 포스트 결정
  const displayPosts = searchResults !== null ? searchResults : posts;

  // 페이지네이션 계산
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return displayPosts.slice(startIndex, endIndex);
  }, [displayPosts, currentPage]);

  const totalPages = Math.ceil(displayPosts.length / POSTS_PER_PAGE);

  return (
    <>
      <Head>
        <title>Dev Soob Log</title>
        <meta name="description" content="A developer's blog about programming, technology, and more." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="Dev Soob Log" />
        <meta property="og:description" content="A developer's blog about programming, technology, and more." />
        <meta property="og:type" content="website" />
      </Head>

      <div className="min-h-screen bg-white dark:bg-[#1a1a1a] flex flex-col">
        <Header onSearchResults={handleSearchResults} onSearching={handleSearching} onSearchVisible={handleSearchVisible} />
        <main className="flex-1 max-w-4xl mx-auto px-4 pt-24 pb-8 w-full">
          <section className={`space-y-8 ${isSearchVisible ? 'mt-8 xs:mt-0' : ''}`}>
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-12 xs:py-16">
                <div className="w-8 h-8 xs:w-12 xs:h-12 border-4 border-gray-200 dark:border-gray-700 border-t-black dark:border-t-white rounded-full animate-spin mb-3 xs:mb-4" />
                <p className="text-sm xs:text-base text-gray-600 dark:text-gray-400">검색 중...</p>
              </div>
            ) : displayPosts.length > 0 ? (
              <>
                {/* 포스트 목록 */}
                {paginatedPosts.map((post) => (
                  <PostCard key={post.id || post.slug} post={post} />
                ))}
                
                {/* 페이지네이션 */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              searchResults !== null && (
                <div className="flex flex-col items-center justify-center py-12 xs:py-16">
                  <span className="text-4xl xs:text-5xl mb-3 xs:mb-4">🤔</span>
                  <p className="text-sm xs:text-base text-gray-600 dark:text-gray-400">검색 결과가 없습니다.</p>
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
  const posts = await getPublishedPosts();
  
  // 날짜 기준으로 정렬 (최신순)
  const sortedPosts = posts.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return { 
    props: { 
      posts: sortedPosts 
    },
    revalidate: 60 // 1분마다 재생성
  };
};
