import { GetStaticProps, GetStaticPaths } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getPublishedPosts } from '@/lib/posts';
import { UnifiedPost } from '@/types/post';
import Header from '@/components/Header';
import Footer from "@/components/Footer";
import TableOfContents, { TocItem } from '@/components/TableOfContents';
import MobileTableOfContents from '@/components/MobileTableOfContents';
import GestureIndicator from '@/components/GestureIndicator';
import GestureHelp from '@/components/GestureHelp';
import GiscusComments from '@/components/GiscusComments';
import { useGestureNavigation } from '@/lib/useGestureNavigation';
import { useEffect, useState } from 'react';

interface PostPageProps {
  post: UnifiedPost;
  mdxSource: any;
  prevPost: UnifiedPost | null;
  nextPost: UnifiedPost | null;
}

export default function PostPage({ post, mdxSource, prevPost, nextPost }: PostPageProps) {
  const router = useRouter();
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [gestureDirection, setGestureDirection] = useState<'prev' | 'next' | 'back' | null>(null);
  const [showGestureIndicator, setShowGestureIndicator] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // 제스처 네비게이션 훅 사용
  useGestureNavigation({
    prevPost,
    nextPost,
    onNavigate: (direction) => {
      setGestureDirection(direction);
      setShowGestureIndicator(true);
    }
  });

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

  // 스크롤 이벤트 리스너 추가
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollToTop(scrollTop > 300); // 300px 이상 스크롤했을 때 버튼 표시
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 최상단으로 스크롤하는 함수
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
                {/* 뒤로가기 아이콘 */}
                <div className="mb-6">
                  <button
                    onClick={() => router.back()}
                    className="text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400 transition-colors duration-200"
                  >
                    <svg 
                      width="32" 
                      height="32" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="w-8 h-8"
                    >
                      <path d="m15 18-6-6 6-6"/>
                    </svg>
                  </button>
                </div>

                <div id="post-content" className="prose prose-sm xs:prose-base sm:prose-lg max-w-none dark:prose-invert mt-8">
                  <MDXRemote {...mdxSource} />
                </div>

                {/* 댓글 섹션 */}
                <GiscusComments postSlug={post.slug} postTitle={post.title} />

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
      
      {/* 제스처 네비게이션 인디케이터 */}
      <GestureIndicator 
        direction={gestureDirection} 
        isVisible={showGestureIndicator} 
      />
      
      {/* 제스처 네비게이션 도움말 */}
      <GestureHelp />
      
      {/* 스크롤 to top 버튼 */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-20 lg:right-6 z-50 p-3 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 ${
          showScrollToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="최상단으로 이동"
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="w-5 h-5 lg:w-6 lg:h-6"
        >
          <path d="m18 15-6-6-6 6"/>
        </svg>
      </button>
      
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