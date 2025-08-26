import { GetStaticProps } from "next";
import { UnifiedPost } from "@/types/post";
import { getPublishedPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Head from "next/head";
import { NextSeo } from 'next-seo';
import { useMemo, useState, Suspense, lazy, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import { useRouter } from 'next/router';
import Sidebar from "@/components/Sidebar";
import TagTabs from "@/components/TagTabs";
import MobileCategoryDrawer from "@/components/MobileCategoryDrawer";
import Script from 'next/script';
import LoadingSpinner from "@/components/LoadingSpinner";
import ProfileCard from "@/components/ProfileCard";

// 지연 로딩 컴포넌트
const LazyMobileCategoryDrawer = lazy(() => import("@/components/MobileCategoryDrawer"));

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
    
    // 카테고리 필터링
    if (currentCategory && currentCategory !== '') {
      console.log('Filtering by category:', currentCategory);
      filtered = filtered.filter(post => post.category === currentCategory);
      console.log('Filtered posts count:', filtered.length);
    }
    
    // 태그 필터링
    if (currentTag && currentTag !== '') {
      console.log('Filtering by tag:', currentTag);
      filtered = filtered.filter(post => post.tags?.includes(currentTag));
      console.log('Filtered posts count:', filtered.length);
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

  // 카테고리나 태그가 변경될 때 페이지를 1로 리셋
  useEffect(() => {
    if (currentPage > 1 && totalPages < currentPage) {
      const query = { ...router.query };
      delete query.page;
      router.push({ query }, undefined, { shallow: true });
    }
  }, [currentCategory, currentTag, currentPage, totalPages, router]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    const query = { ...router.query, page };
    // 카테고리나 태그가 변경되면 페이지를 1로 리셋
    if (page === 1) {
      delete query.page;
    }
    router.push({ query }, undefined, { shallow: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <NextSeo
        title="Dev Soob Log - 개발자의 기술 블로그"
        description="프로그래밍, 웹 개발, 백엔드, 프론트엔드, DevOps 등 다양한 개발 기술과 경험을 공유하는 개발자 블로그입니다. React, Node.js, TypeScript, Docker 등 최신 기술 트렌드를 다룹니다."
        canonical={process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-soob-log.vercel.app'}
        openGraph={{
          title: "Dev Soob Log - 개발자의 기술 블로그",
          description: "프로그래밍, 웹 개발, 백엔드, 프론트엔드, DevOps 등 다양한 개발 기술과 경험을 공유하는 개발자 블로그입니다.",
          url: process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-soob-log.vercel.app',
          type: 'website',
          images: [
            {
              url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-soob-log.vercel.app'}/og-image.png`,
              width: 1200,
              height: 630,
              alt: "Dev Soob Log",
              type: 'image/png',
            },
          ],
        }}
        twitter={{
          handle: '@handle',
          site: '@site',
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: '개발, 프로그래밍, 웹 개발, React, Node.js, TypeScript, JavaScript, 백엔드, 프론트엔드, DevOps, Docker, Git',
          },
          {
            name: 'author',
            content: process.env.NEXT_PUBLIC_SITE_AUTHOR || 'Choi Soobin',
          },
        ]}
      />
      
      {/* JSON-LD 구조화 데이터 */}
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Dev Soob Log",
            "description": "프로그래밍, 웹 개발, 백엔드, 프론트엔드, DevOps 등 다양한 개발 기술과 경험을 공유하는 개발자 블로그",
            "url": process.env.NEXT_PUBLIC_SITE_URL || "https://dev-soob-log.vercel.app",
            "author": {
              "@type": "Person",
              "name": process.env.NEXT_PUBLIC_SITE_AUTHOR || "Choi Soobin"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Dev Soob Log"
            },
            "inLanguage": "ko-KR",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-soob-log.vercel.app'}/search?q={search_term_string}`
              },
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />

      <div className="min-h-screen bg-white dark:bg-[#1a1a1a] flex flex-col">
        <Header />
        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 mobile-container overflow-hidden">
            {/* 모바일에서도 프로필 노출 */}
            <div className="md:hidden mb-6">
              <ProfileCard />
            </div>
            <div className="flex gap-8">
              <Sidebar categories={categories} />
              <div className="flex-1 min-w-0 mobile-text-safe overflow-hidden">
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
                        maxVisiblePages={5}
                        enableFirstLastNav
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
          className="fixed right-4 bottom-4 w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center md:hidden transition-colors duration-200 z-30 min-w-[44px] min-h-[44px]"
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
        <Suspense fallback={<LoadingSpinner />}>
          <LazyMobileCategoryDrawer
            categories={categories}
            isOpen={isCategoryDrawerOpen}
            onClose={() => setIsCategoryDrawerOpen(false)}
          />
        </Suspense>
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
