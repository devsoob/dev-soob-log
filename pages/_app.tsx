import React, { useEffect, useState } from "react";
import { MDXProvider } from "@mdx-js/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { DefaultSeo } from 'next-seo';
import LoadingSpinner from "@/components/LoadingSpinner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CodeBlock from "@/components/CodeBlock";
import InlineCode from "@/components/InlineCode";
import localFont from 'next/font/local';
import "../styles/globals.css";
import Head from "next/head";
import { SITE_CONFIG, SEO_CONFIG, META_TAGS } from '@/lib/constants';

// 폰트 설정
const pretendard = localFont({
  src: [
    {
      path: '../public/fonts/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Pretendard-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Pretendard-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
  display: 'swap',
});

// MDX 컴포넌트 설정
const mdxComponents = {
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-3xl font-bold mt-8 mb-4 scroll-mt-24" {...props}>{children}</h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-bold mt-6 mb-3 scroll-mt-24" {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl font-semibold mt-4 mb-2 scroll-mt-24" {...props}>{children}</h3>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 leading-relaxed" {...props}>{children}</p>
  ),
  a: ({ children, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-blue-500 hover:text-blue-600 underline" {...props}>{children}</a>
  ),
  code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isCodeBlock = className && className.includes('language-');
    
    if (isCodeBlock) {
      return (
        <CodeBlock className={className} {...props}>
          {children as string}
        </CodeBlock>
      );
    }
    
    return (
      <InlineCode className={className} {...props}>
        {children}
      </InlineCode>
    );
  },
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    return (
      <div className="notion-code-block my-6">
        <pre className="p-4 m-0 bg-transparent" {...props}>
          {children}
        </pre>
      </div>
    );
  },
};

// 라우터 이벤트 핸들러 훅
function useRouterEvents() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);
    const handleError = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleError);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleError);
    };
  }, [router]);

  return isLoading;
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const isLoading = useRouterEvents();

  return (
    <MDXProvider components={mdxComponents}>
      <Head>
        <title>{SITE_CONFIG.name}</title>
        <meta name="description" content={SITE_CONFIG.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DefaultSeo
        title={SITE_CONFIG.name}
        titleTemplate={SEO_CONFIG.titleTemplate}
        description={SITE_CONFIG.description}
        canonical={SITE_CONFIG.url}
        openGraph={{
          type: 'website',
          locale: SEO_CONFIG.locale,
          url: SITE_CONFIG.url,
          siteName: SITE_CONFIG.name,
          images: [
            {
              url: `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
              width: 1200,
              height: 630,
              alt: SITE_CONFIG.name,
            },
          ],
        }}
        twitter={{
          handle: SEO_CONFIG.twitterHandle,
          site: SEO_CONFIG.twitterSite,
          cardType: SEO_CONFIG.twitterCardType,
        }}
        additionalMetaTags={[
          {
            name: 'viewport',
            content: META_TAGS.viewport,
          },
          {
            name: 'naver-site-verification',
            content: META_TAGS.naverSiteVerification,
          },
          {
            name: 'google-site-verification',
            content: META_TAGS.googleSiteVerification,
          },
          {
            name: 'author',
            content: SITE_CONFIG.author,
          },
          {
            name: 'keywords',
            content: SEO_CONFIG.keywords,
          },
          {
            name: 'theme-color',
            content: SEO_CONFIG.themeColor,
          },
          {
            name: 'apple-mobile-web-app-capable',
            content: META_TAGS.appleMobileWebAppCapable,
          },
          {
            name: 'apple-mobile-web-app-status-bar-style',
            content: META_TAGS.appleMobileWebAppStatusBarStyle,
          },
        ]}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: '/favicon.ico',
          },
          {
            rel: 'manifest',
            href: '/manifest.json',
          },
          {
            rel: 'apple-touch-icon',
            href: '/icons/apple-touch-icon.png',
            sizes: '180x180',
          },
        ]}
      />
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
      <style jsx global>{`
        :root {
          --font-pretendard: ${pretendard.style.fontFamily};
        }
      `}</style>
      <main className={`${pretendard.variable} font-sans`}>
        {isLoading && <div className="loading-line" />}
        <Component {...pageProps} />
      </main>
    </MDXProvider>
  );
}
