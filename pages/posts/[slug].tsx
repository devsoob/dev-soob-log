import { GetStaticProps, GetStaticPaths } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { getPublishedPosts } from '@/lib/posts';
import { UnifiedPost } from '@/types/post';
import Header from '@/components/Header';
import Footer from "@/components/Footer";
import TableOfContents, { TocItem } from '@/components/TableOfContents';
import MobileTableOfContents from '@/components/MobileTableOfContents';
import GestureIndicator from '@/components/GestureIndicator';
import GestureHelp from '@/components/GestureHelp';
import ReadingProgress from '@/components/ReadingProgress';
import ShareButtons from '@/components/ShareButtons';
import { findRelatedPosts, findRelatedPostsByCategory } from '@/lib/relatedPosts';
import { useGestureNavigation } from '@/lib/useGestureNavigation';
import { useEffect, useState, Suspense, lazy } from 'react';
import Script from 'next/script';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useTableOfContents } from '@/hooks/useTableOfContents';

// 지연 로딩 컴포넌트
const LazyGiscusComments = lazy(() => import('@/components/GiscusComments'));
const LazyRelatedPosts = lazy(() => import('@/components/RelatedPosts'));

// MDX 컴포넌트 정의
const mdxComponents = {
  img: ({ src, alt, width, height, ...props }: any) => (
    <div className="relative w-full my-4">
      <Image
        src={src}
        alt={alt || ''}
        width={width || 800}
        height={height || 600}
        className="rounded-lg"
        priority={false}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        {...props}
      />
      {alt && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">{alt}</p>
      )}
    </div>
  ),
};

interface PostPageProps {
  post: UnifiedPost;
  mdxSource: any;
  prevPost: UnifiedPost | null;
  nextPost: UnifiedPost | null;
  relatedPosts: UnifiedPost[];
}

// 상세 페이지에서 제목과 설명을 제거하는 함수
function stripTitleAndDescription(markdown: string, title: string, description: string) {
  // 제목(헤더) 제거: # 제목\n 또는 ## 제목\n
  let result = markdown.replace(new RegExp(`^#{1,6}\\s*${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\n+`, 'm'), '');
  // 설명(첫 문단) 제거: description이 있으면 제거
  if (description) {
    result = result.replace(new RegExp(`^${description.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\n+`, 'm'), '');
  }
  return result;
}

export default function PostPage({ post, mdxSource, prevPost, nextPost, relatedPosts }: PostPageProps) {
  const router = useRouter();
  const { from_page } = router.query;

  const handleBackToList = () => {
    if (from_page) {
      router.push({
        pathname: '/',
        query: { page: from_page }
      });
    } else {
      router.push('/');
    }
  };

  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [gestureDirection, setGestureDirection] = useState<'prev' | 'next' | 'back' | null>(null);
  const [showGestureIndicator, setShowGestureIndicator] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // 공통 목차 훅 사용 (tocItems가 있을 때만)
  const { activeId, scrollToHeading, updateActiveId } = useTableOfContents(tocItems.length > 0 ? tocItems : []);

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
    // MDX 콘텐츠가 렌더링된 후 목차 생성
    const timeoutId = setTimeout(() => {
      // article 내부의 h1, h2, h3 태그를 찾아서 목차 생성
      const headings = document.querySelectorAll('article h1, article h2, article h3');
      const items: TocItem[] = [];

      headings.forEach((heading, index) => {
        const id = (heading as HTMLElement).id || `heading-${index}`;
        if (!(heading as HTMLElement).id) {
          (heading as HTMLElement).id = id;
        }

        items.push({
          id,
          text: heading.textContent || '',
          level: parseInt(heading.tagName.charAt(1))
        });
      });

      setTocItems(items);
    }, 500); // MDX 렌더링 완료 후 목차 생성

    return () => clearTimeout(timeoutId);
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
      <NextSeo
        title={`${post.title} | Dev Soob Log`}
        description={post.description}
        canonical={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-soob-log.vercel.app'}/posts/${post.slug}`}
        openGraph={{
          title: post.title,
          description: post.description,
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-soob-log.vercel.app'}/posts/${post.slug}`,
          type: 'article',
          article: {
            publishedTime: post.date,
            modifiedTime: post.date,
            authors: [process.env.NEXT_PUBLIC_SITE_AUTHOR || 'Choi Soobin'],
            tags: post.tags || [],
          },
          images: [
            {
              url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-soob-log.vercel.app'}/og-image.png`,
              width: 1200,
              height: 630,
              alt: post.title,
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
            content: post.keywords ? post.keywords.join(', ') : (post.tags ? post.tags.join(', ') : 'development, programming, web development'),
          },
          {
            name: 'author',
            content: process.env.NEXT_PUBLIC_SITE_AUTHOR || 'Choi Soobin',
          },
          {
            property: 'article:published_time',
            content: post.date,
          },
          {
            property: 'article:modified_time',
            content: post.date,
          },
          {
            property: 'article:author',
            content: process.env.NEXT_PUBLIC_SITE_AUTHOR || 'Choi Soobin',
          },
          ...(post.tags ? post.tags.map(tag => ({
            property: 'article:tag',
            content: tag,
          })) : []),
        ]}
      />
      
      {/* JSON-LD 구조화 데이터 */}
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.description,
            "author": {
              "@type": "Person",
              "name": process.env.NEXT_PUBLIC_SITE_AUTHOR || "Choi Soobin"
            },
            "datePublished": post.date,
            "dateModified": post.lastModified || post.date,
            "publisher": {
              "@type": "Organization",
              "name": "Dev Soob Log",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://dev-soob-log.vercel.app"
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-soob-log.vercel.app'}/posts/${post.slug}`
            },
            "keywords": post.keywords ? post.keywords.join(', ') : (post.tags ? post.tags.join(', ') : ''),
            "articleSection": post.category,
            "inLanguage": "ko-KR"
          })
        }}
      />

      <Header />
      
      {/* 읽기 진행률 바 */}
      <ReadingProgress />

      <main className="flex-1 w-full pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className={tocItems.length > 0 ? "md:flex md:items-start md:justify-between md:gap-8" : ""}>
            {/* 메인 콘텐츠 */}
            <div className={tocItems.length > 0 ? "w-full md:flex-1 md:max-w-none md:pr-72" : "w-full max-w-4xl mx-auto"}>
              <article className="min-w-0">


                {/* 포스트 헤더 */}
                <header className="mb-8">
                  <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-primary mb-4" style={{ lineHeight: '1.3' }}>
                    {post.title}
                  </h1>
                  <div className="flex flex-col gap-3 text-xs xs:text-sm sm:text-base text-tertiary">
                    {/* 첫 번째 줄: 날짜와 카테고리 */}
                    <div className="flex flex-wrap items-center gap-2 xs:gap-4">
                      <div className="flex items-center">
                        <svg className="w-3 h-3 xs:w-4 xs:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                      {post.category && (
                        <div className="flex items-center">
                          <svg className="w-3 h-3 xs:w-4 xs:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <span>{post.category}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* 두 번째 줄: 태그들 */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 xs:gap-2 items-center">
                        {post.tags.map((tag) => (
                          <span key={tag} className="px-1.5 xs:px-2 py-0.5 rounded bg-tertiary text-xs text-secondary">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {post.description && (
                    <p className="text-lg text-secondary mt-4 leading-relaxed">
                      {post.description}
                    </p>
                  )}
                </header>

                {/* 공유 버튼 */}
                <ShareButtons post={post} />

                <div id="main-content" className="prose prose-sm xs:prose-base sm:prose-lg max-w-none dark:prose-invert mt-8">
                  <MDXRemote {...mdxSource} components={mdxComponents} />
                </div>

                {/* 댓글 섹션 */}
                <Suspense fallback={<div className="mt-8 flex justify-center"><LoadingSpinner /></div>}>
                  <LazyGiscusComments postSlug={post.slug} postTitle={post.title} />
                </Suspense>

                {/* 이전/다음 글 네비게이션 */}
                {(prevPost || nextPost) && (
                  <nav className="mt-12 pt-8 border-t border-primary">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      {prevPost ? (
                        <Link 
                          href={`/posts/${prevPost.slug}`}
                          className="group flex-1 p-4 rounded-lg border border-primary hover:border-secondary transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="mr-3 text-muted group-hover:text-secondary transition-colors">
                              ←
                            </div>
                            <div>
                                                          <div className="text-sm text-tertiary mb-1">
                              이전 글
                            </div>
                            <div className="text-base font-medium text-primary group-hover:text-link transition-colors">
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
                          className="group flex-1 p-4 rounded-lg border border-primary hover:border-secondary transition-colors"
                        >
                          <div className="flex items-center justify-end">
                            <div>
                              <div className="text-sm text-tertiary mb-1 text-right">
                                다음 글
                              </div>
                              <div className="text-base font-medium text-primary group-hover:text-link transition-colors">
                                {nextPost.title}
                              </div>
                            </div>
                            <div className="ml-3 text-muted group-hover:text-secondary transition-colors">
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

                {/* 관련 포스트 섹션 */}
                <Suspense fallback={<div className="mt-8 flex justify-center"><LoadingSpinner /></div>}>
                  <LazyRelatedPosts posts={relatedPosts} />
                </Suspense>
              </article>
            </div>
            
            {/* 데스크톱 목차 */}
            {tocItems.length > 0 && (
              <aside
                className="hidden md:block w-64 flex-shrink-0 ml-8 md:ml-0 md:fixed md:top-24 z-30"
                style={{ right: 'max(calc((100vw - 72rem) / 2), 1rem)' }}
              >
                <div className="max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 toc-scrollbar">
                  <TableOfContents 
                    tocItems={tocItems} 
                    activeId={activeId}
                    onHeadingClick={scrollToHeading}
                  />
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>
      
      {/* 모바일 목차 */}
      {tocItems.length > 0 && (
        <div className="block md:hidden">
          <MobileTableOfContents 
            tocItems={tocItems} 
            activeId={activeId}
            onHeadingClick={scrollToHeading}
            onUpdateActiveId={updateActiveId}
          />
        </div>
      )}
      
      {/* 제스처 네비게이션 인디케이터 */}
      <GestureIndicator 
        direction={gestureDirection} 
        isVisible={showGestureIndicator} 
      />
      
      {/* 제스처 네비게이션 도움말 */}
      <GestureHelp />
      
      {/* 플로팅 액션 버튼들 */}
      {/* 데스크톱/태블릿: 오른쪽에 배치 */}
      <div className="hidden md:flex fixed bottom-8 right-6 z-40 flex-col gap-4" style={{ right: 'max(calc(50% - 36rem - 4rem), 2rem)' }}>
        {/* 스크롤 to top 버튼 */}
        <button
          onClick={scrollToTop}
          className={`p-3 rounded-full bg-gray-700 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 ${
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
        
        {/* 홈으로 가기 버튼 */}
        <button
          onClick={() => router.push('/')}
          className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-colors duration-200"
          aria-label="홈으로 이동"
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
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
      </div>

      {/* 모바일: 하단에 배치 */}
      <div className="md:hidden fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* 스크롤 to top 버튼 */}
        <button
          onClick={scrollToTop}
          className={`p-3 rounded-full bg-gray-700 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 ${
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
        
        {/* 홈으로 가기 버튼 */}
        <button
          onClick={() => router.push('/')}
          className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-colors duration-200"
          aria-label="홈으로 이동"
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
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
        
        {/* 목록으로 가기 버튼 */}
        <button
          onClick={() => router.push('/')}
          className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-colors duration-200"
          aria-label="목록으로 이동"
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
            <path d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
      
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

  // 관련 포스트 찾기
  let relatedPosts = findRelatedPosts(post, posts, 6);
  
  // 관련 포스트가 없으면 카테고리 기반으로 찾기
  if (relatedPosts.length === 0) {
    relatedPosts = findRelatedPostsByCategory(post, posts, 6);
  }
  
  // 그래도 없으면 최근 포스트 3개
  if (relatedPosts.length === 0) {
    relatedPosts = posts
      .filter(p => p.slug !== post.slug)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }

  // 제목과 설명 제거
  const strippedContent = stripTitleAndDescription(post.content, post.title, post.description);
  const mdxSource = await serialize(strippedContent);

  return {
    props: {
      post,
      mdxSource,
      prevPost,
      nextPost,
      relatedPosts,
    },
    revalidate: 60, // 1분마다 재생성
  };
}; 