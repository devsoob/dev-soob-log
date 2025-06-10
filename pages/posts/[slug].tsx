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
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.description} />
      </Head>

      <Header />

      <article className="flex-1 max-w-4xl mx-auto px-4 pt-24 pb-8 w-full">
        <Link href="/" className="text-blue-500 hover:text-blue-600 mb-4 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-4 text-black dark:text-white">{post.title}</h1>
        <div className="flex flex-col gap-3 text-black dark:text-white">
          <time dateTime={post.date} className="text-sm">
            {new Date(post.date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).replace(/\./g, '/').replace(/\s/g, '').replace(/\/$/, '')}
          </time>
          <div className="flex items-center gap-2">
            <span className="text-lg">{post.category}</span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="bg-white dark:bg-black border border-black dark:border-white px-2 py-1 rounded-md text-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <p className="mt-2 text-lg">{post.description}</p>
        </div>

        <div className="prose prose-lg max-w-none dark:prose-invert mt-8">
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