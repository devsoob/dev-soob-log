import { GetStaticProps } from "next";
import { UnifiedPost } from "@/types/post";
import { getPublishedPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Search from "@/components/Search";
import Head from "next/head";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Props {
  posts: UnifiedPost[];
}

export default function Home({ posts }: Props) {
  const [searchResults, setSearchResults] = useState<UnifiedPost[] | null>(null);

  const handleSearchResults = (results: UnifiedPost[] | null) => {
    setSearchResults(results);
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
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 pt-24 pb-8 w-full">
          <div className="mb-8">
            <Search onSearchResults={handleSearchResults} />
          </div>

          <section className="space-y-8">
            {displayPosts.length > 0 ? (
              displayPosts.map((post) => (
                <PostCard key={post.id || post.slug} post={post} />
              ))
            ) : (
              searchResults !== null && (
                <p className="text-center text-black dark:text-white py-8">
                  검색 결과가 없습니다.
                </p>
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
