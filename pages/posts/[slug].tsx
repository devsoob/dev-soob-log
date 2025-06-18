import { GetStaticProps, GetStaticPaths } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Head from 'next/head';
import Link from 'next/link';
import { getPublishedPosts } from '@/lib/posts';
import { UnifiedPost } from '@/types/post';
import Header from '@/components/Header';
import Footer from "@/components/Footer";

interface PostPageProps {
  post: UnifiedPost;
  mdxSource: any;
}

export default function PostPage({ post, mdxSource }: PostPageProps) {
  if (!post) return <div>Post not found</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-[#1a1a1a] flex flex-col">
      <Head>
        <title>Dev Log's</title>
        <meta name="description" content={post.description} />
      </Head>

      <Header />

      <article className="flex-1 max-w-4xl mx-auto px-4 xs:px-6 sm:px-10 pt-20 xs:pt-24 pb-8 w-full">
        <Link href="/" className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 mb-4 inline-block text-base xs:text-lg sm:text-xl">
          ← Back to Home
        </Link>
        <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-4 text-black dark:text-white break-words">
          {post.title}
        </h1>
        <div className="flex flex-col gap-2 xs:gap-3 text-black dark:text-white">
          <time dateTime={post.date} className="text-xs xs:text-sm sm:text-base">
            {new Date(post.date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).replace(/\./g, '.').replace(/\s/g, '').replace(/\.$/, '')}
          </time>
          <div className="flex items-center gap-2 xs:gap-3">
            <span className="text-sm xs:text-base sm:text-lg">{post.category}</span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 xs:gap-3 mt-2">
              {post.tags.map(tag => (
                <span key={tag} className="bg-white dark:bg-[#1a1a1a] border border-black dark:border-white px-2 py-1 rounded-md text-xs xs:text-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <p className="mt-2 text-sm xs:text-base sm:text-lg break-words">{post.description}</p>
        </div>

        <div className="prose prose-sm xs:prose-base sm:prose-lg max-w-none dark:prose-invert mt-8">
          <MDXRemote {...mdxSource} />
        </div>
      </article>
      <Footer />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPublishedPosts();
  
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const posts = await getPublishedPosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  const mdxSource = await serialize(post.content);

  return {
    props: {
      post,
      mdxSource,
    },
    revalidate: 60, // 1분마다 재생성
  };
}; 