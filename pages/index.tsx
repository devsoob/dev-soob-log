import { GetStaticProps } from "next";
import { UnifiedPost } from "@/types/post";
import { getPublishedPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Search from "@/components/Search";
import Head from "next/head";

interface Props {
  posts: UnifiedPost[];
}

export default function Home({ posts }: Props) {
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Dev Log</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Thoughts, learnings, and experiences in software development
          </p>
        </header>

        <div className="mb-8">
          <Search />
        </div>

        <section className="space-y-8">
          {posts.map((post) => (
            <PostCard key={post.id || post.slug} post={post} />
          ))}
        </section>
      </main>
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
