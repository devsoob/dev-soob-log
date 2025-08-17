import { NextSeo } from 'next-seo';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect } from 'react';

// Google Analytics 타입 정의
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function Custom404() {
  useEffect(() => {
    // 404 페이지 방문 시 analytics 이벤트 전송 (선택사항)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: '404 - Page Not Found',
        page_location: window.location.href,
      });
    }
  }, []);

  return (
    <>
      <NextSeo
        title="404 - 페이지를 찾을 수 없습니다 | Dev Soob Log"
        description="요청하신 페이지를 찾을 수 없습니다. 홈페이지로 돌아가거나 다른 페이지를 확인해보세요."
        noindex={true}
        nofollow={true}
      />
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#1a1a1a]">
        <Header />
        
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* 404 숫자 */}
            <div className="mb-8">
              <h1 className="text-8xl sm:text-9xl font-bold text-gray-300 dark:text-gray-700 select-none">
                404
              </h1>
            </div>
            
            {/* 메인 메시지 */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                페이지를 찾을 수 없습니다
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
                <br className="hidden sm:block" />
                URL을 다시 확인하거나 아래 링크를 이용해보세요.
              </p>
            </div>
            
            {/* 홈 버튼 */}
            <div className="flex justify-center items-center mb-12">
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 dark:focus:ring-offset-gray-900 min-w-[160px] justify-center"
              >
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
} 