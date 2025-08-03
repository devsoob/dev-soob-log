import { GetStaticProps } from "next";
import { UnifiedPost } from "@/types/post";
import { getPublishedPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Head from "next/head";
import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import { useRouter } from 'next/router';
import Sidebar from "@/components/Sidebar";
import TagTabs from "@/components/TagTabs";
import MobileCategoryDrawer from "@/components/MobileCategoryDrawer";

interface Props {
  posts: UnifiedPost[];
  categories: { name: string; count: number; }[];
  tags: { name: string; count: number; }[];
}

export default function Home({ posts, categories, tags }: Props) {
  const router = useRouter();
  const currentPage = Number(router.query.page) || 1;
  const currentCategory = router.query.category as string;
  const currentTag = router.query.tag as string;
  const POSTS_PER_PAGE = 6;

  // 모바일 카테고리 드로어 상태
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);

  // 필터링된 포스트
  const filteredPosts = useMemo(() => {
    let filtered = [...posts];
    if (currentCategory) {
      filtered = filtered.filter(post => post.category === currentCategory);
    }
    if (currentTag) {
      filtered = filtered.filter(post => post.tags?.includes(currentTag));
    }
    return filtered;
  }, [posts, currentCategory, currentTag]);

  // 페이지네이션 계산
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    const query = { ...router.query, page };
    router.push({ query }, undefined, { shallow: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        <Header />
        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 pt-20 pb-8">
            <div className="flex gap-8">
              <Sidebar categories={categories} />
              <div className="flex-1 min-w-0">
                <TagTabs tags={tags} />
                <section className="space-y-12">
                  {paginatedPosts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                  
                  {totalPages > 1 && (
                    <div className="pt-4">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        </main>
        <Footer />

        {/* 모바일 카테고리 플로팅 버튼 */}
        <button
          onClick={() => setIsCategoryDrawerOpen(true)}
          className="fixed right-4 bottom-4 w-12 h-12 bg-blue-500 dark:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center md:hidden hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors z-30"
          aria-label="Open categories"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* 모바일 카테고리 드로어 */}
        <MobileCategoryDrawer
          categories={categories}
          isOpen={isCategoryDrawerOpen}
          onClose={() => setIsCategoryDrawerOpen(false)}
        />
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

  // 카테고리 집계
  const categoryCount = sortedPosts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = Object.entries(categoryCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // 태그 집계
  const tagCount = sortedPosts.reduce((acc, post) => {
    post.tags?.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const tags = Object.entries(tagCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return { 
    props: { 
      posts: sortedPosts,
      categories,
      tags,
    },
    revalidate: 60 // 1분마다 재생성
  };
};
