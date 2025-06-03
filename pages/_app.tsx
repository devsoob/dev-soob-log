import React, { useEffect, useState } from "react";
import { MDXProvider } from "@mdx-js/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { DefaultSeo } from 'next-seo';
import LoadingSpinner from "@/components/LoadingSpinner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import localFont from 'next/font/local';
import "../styles/globals.css";

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
    <h1 className="text-3xl font-bold mt-8 mb-4" {...props}>{children}</h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-bold mt-6 mb-3" {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl font-semibold mt-4 mb-2" {...props}>{children}</h3>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 leading-relaxed" {...props}>{children}</p>
  ),
  a: ({ children, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-blue-500 hover:text-blue-600 underline" {...props}>{children}</a>
  ),
  code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded" {...props}>{children}</code>
  ),
};

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };

    const handleComplete = () => {
      setIsLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <MDXProvider components={mdxComponents}>
      <DefaultSeo
        title={process.env.NEXT_PUBLIC_SITE_NAME || 'Dev Log'}
        description={process.env.NEXT_PUBLIC_SITE_DESCRIPTION || '개발 경험과 지식을 공유하는 개발 블로그'}
        canonical={process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-log-pi.vercel.app'}
        openGraph={{
          type: 'website',
          locale: 'ko_KR',
          url: process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-log-pi.vercel.app',
          siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Dev Log',
          images: [
            {
              url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dev-log-pi.vercel.app'}/og-image.png`,
              width: 1200,
              height: 630,
              alt: process.env.NEXT_PUBLIC_SITE_NAME || 'Dev Log',
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
            name: 'author',
            content: process.env.NEXT_PUBLIC_SITE_AUTHOR || 'Author Name',
          },
        ]}
      />
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
      <div className={`${pretendard.variable} font-sans min-h-screen`}>
        {isLoading && <LoadingSpinner />}
        <Component {...pageProps} />
      </div>
    </MDXProvider>
  );
}
