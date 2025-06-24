import { GetStaticProps, GetStaticPaths } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Head from 'next/head';
import Link from 'next/link';
import { getPublishedPosts } from '@/lib/posts';
import { UnifiedPost } from '@/types/post';
import Header from '@/components/Header';
import Footer from "@/components/Footer";
import TableOfContents, { TocItem } from '@/components/TableOfContents';
import MobileTableOfContents from '@/components/MobileTableOfContents';
import { useEffect, useState } from 'react';

interface PostPageProps {
  post: UnifiedPost;
  mdxSource: any;
  prevPost: UnifiedPost | null;
  nextPost: UnifiedPost | null;
}

export default function PostPage({ post, mdxSource, prevPost, nextPost }: PostPageProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  useEffect(() => {
    // .prose 클래스 내부의 h1, h2, h3 태그를 찾아서 목차 생성
    const headings = document.querySelectorAll('#post-content h1, #post-content h2, #post-content h3');
    const items: TocItem[] = [];

    headings.forEach((heading, index) => {
      const id = heading.id || `heading-${index}`;
      if (!heading.id) {
        heading.id = id;
      }

      items.push({
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1))
      });
    });

    setTocItems(items);
  }, [mdxSource]); // mdxSource가 변경될 때마다 목차를 다시 생성합니다.

  if (!post) return <div>Post not found</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-[#1a1a1a] flex flex-col">
      <Head>
        <title>{post.title} | Dev Log&apos;s</title>
        <meta name="description" content={post.description} />
      </Head>

      <Header />

      <main className="flex-1 w-full pt-20 xs:pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 xs:px-6 sm:px-10">
          <div className="lg:flex lg:justify-center lg:gap-8 lg:items-start">
            <div className="w-full max-w-4xl">
              <article className="min-w-0">

                <div id="post-content" className="prose prose-sm xs:prose-base sm:prose-lg max-w-none dark:prose-invert mt-8">
                  <MDXRemote {...mdxSource} />
                </div>

                {/* 이전/다음 글 네비게이션 */}
                {(prevPost || nextPost) && (
                  <nav className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      {prevPost ? (
                        <Link 
                          href={`/posts/${prevPost.slug}`}
                          className="group flex-1 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="mr-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                              ←
                            </div>
                            <div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                이전 글
                              </div>
                              <div className="text-base font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {prevPost.title}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <div className="flex-1" />
                      )}
                      
                      {nextPost ? (
                        <Link 
                          href={`/posts/${nextPost.slug}`}
                          className="group flex-1 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                        >
                          <div className="flex items-center justify-end">
                            <div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 text-right">
                                다음 글
                              </div>
                              <div className="text-base font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {nextPost.title}
                              </div>
                            </div>
                            <div className="ml-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                              →
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <div className="flex-1" />
                      )}
                    </div>
                  </nav>
                )}
              </article>
            </div>
            
            {tocItems.length > 0 && (
              <aside className="hidden lg:sticky lg:top-24 lg:block flex-shrink-0">
                <TableOfContents tocItems={tocItems} />
              </aside>
            )}
          </div>
        </div>
      </main>
      
      {/* 모바일 목차 */}
      <MobileTableOfContents tocItems={tocItems} />
      
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
  const postIndex = posts.findIndex((p) => p.slug === slug);
  const post = posts[postIndex];

  if (!post) {
    return {
      notFound: true,
    };
  }

  // 이전/다음 글 찾기
  const prevPost = postIndex > 0 ? posts[postIndex - 1] : null;
  const nextPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : null;

  const mdxSource = await serialize(post.content);

  return {
    props: {
      post,
      mdxSource,
      prevPost,
      nextPost,
    },
    revalidate: 60, // 1분마다 재생성
  };
}; 