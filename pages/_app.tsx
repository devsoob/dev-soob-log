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

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };

    const handleComplete = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setIsLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleError);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleError);
    };
  }, [router]);

  return (
    <MDXProvider components={mdxComponents}>
      <Head>
        <title>Dev Soob Log</title>
        <meta name="description" content="Choi Soobin&apos;s Development Blog" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DefaultSeo
        title="Dev Soob Log"
        titleTemplate="%s | Dev Soob Log"
        description={process.env.NEXT_PUBLIC_SITE_DESCRIPTION || '개발 경험과 지식을 공유하는 개발 블로그'}
        canonical={process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-soob-log.vercel.app'}
        openGraph={{
          type: 'website',
          locale: 'ko_KR',
          url: process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-soob-log.vercel.app',
          siteName: "Dev Soob Log",
          images: [
            {
              url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-soob-log.vercel.app'}/og-image.png`,
              width: 1200,
              height: 630,
              alt: "Dev Soob Log",
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
            name: 'viewport',
            content: 'width=device-width, initial-scale=1',
          },
          {
            name: 'naver-site-verification',
            content: '01f879679eb5dd93ae99dc948742910e33135369',
          },
          {
            name: 'google-site-verification',
            content: 'YOUR_GOOGLE_SITE_VERIFICATION_CODE_HERE',
          },
          {
            name: 'author',
            content: process.env.NEXT_PUBLIC_SITE_AUTHOR || 'Author Name',
          },
          {
            name: 'keywords',
            content: 'development, programming, web development, software engineering, tech blog',
          },
          {
            name: 'theme-color',
            content: '#000000',
          },
          {
            name: 'apple-mobile-web-app-capable',
            content: 'yes',
          },
          {
            name: 'apple-mobile-web-app-status-bar-style',
            content: 'black',
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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:outline-none"
      >
        메인 콘텐츠로 바로가기
      </a>
      <div className="min-h-screen">
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
      </div>
    </MDXProvider>
  );
}
