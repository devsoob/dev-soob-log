import { GetStaticProps } from "next";
import { UnifiedPost } from "@/types/post";
import { getPublishedPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Head from "next/head";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Props {
  posts: UnifiedPost[];
}

export default function Home({ posts }: Props) {
  const [searchResults, setSearchResults] = useState<UnifiedPost[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchResults = (results: UnifiedPost[] | null) => {
    setSearchResults(results);
  };

  const handleSearching = (searching: boolean) => {
    setIsSearching(searching);
  };

  // 표시할 포스트 결정
  const displayPosts = searchResults !== null ? searchResults : posts;

  return (
    <>
      <Head>
        <title>Dev Log</title>
        <meta name="description" content="A developer's blog about programming, technology, and more." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="Dev Log" />
        <meta property="og:description" content="A developer's blog about programming, technology, and more." />
        <meta property="og:type" content="website" />
      </Head>

      <div className="min-h-screen bg-white dark:bg-black flex flex-col">
        <Header onSearchResults={handleSearchResults} onSearching={handleSearching} />
        <main className="flex-1 max-w-4xl mx-auto px-4 pt-24 pb-8 w-full">
          <section className="space-y-8">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-black dark:border-t-white rounded-full animate-spin mb-4" />
                <p className="text-gray-600 dark:text-gray-400">검색 중...</p>
              </div>
            ) : displayPosts.length > 0 ? (
              displayPosts.map((post) => (
                <PostCard key={post.id || post.slug} post={post} />
              ))
            ) : (
              searchResults !== null && (
                <div className="flex flex-col items-center justify-center py-16">
                  <span className="text-5xl mb-4">🤔</span>
                  <p className="text-gray-600 dark:text-gray-400">검색 결과가 없습니다.</p>
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
