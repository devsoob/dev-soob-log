import { GetStaticProps } from "next";
import { UnifiedPost } from "@/types/post";
import { getPublishedPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Head from "next/head";
import { useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import { useRouter } from 'next/router';

interface Props {
  posts: UnifiedPost[];
}

export default function Home({ posts }: Props) {
  const router = useRouter();
  const currentPage = Number(router.query.page) || 1;
  const POSTS_PER_PAGE = 6;

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    router.push({ query: { page } }, undefined, { shallow: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 페이지네이션 계산
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return posts.slice(startIndex, endIndex);
  }, [posts, currentPage]);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

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
        <main className="flex-1 max-w-4xl mx-auto px-4 pt-20 pb-8 w-full">
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
