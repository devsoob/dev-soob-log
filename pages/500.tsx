import { NextSeo } from 'next-seo';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Custom500() {
  return (
    <>
      <NextSeo
        title="500 - 서버 에러 | Dev Soob Log"
        description="요청을 처리하는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
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
            <div className="mb-8">
              <h1 className="text-8xl sm:text-9xl font-bold text-gray-300 dark:text-gray-700 select-none">
                500
              </h1>
            </div>
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                문제가 발생했습니다
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                서버에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
              </p>
            </div>
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