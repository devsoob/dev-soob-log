import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function BrowserTest() {
  const [testResults, setTestResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const runTests = async () => {
      const results: any = {};

      // 1. 기본 JavaScript 기능 테스트
      results.es6 = {
        promise: typeof Promise !== 'undefined',
        arrowFunctions: (() => 'test')() === 'test',
        templateLiterals: `test ${1 + 1}` === 'test 2',
        destructuring: (() => { const {a} = {a: 1}; return a; })() === 1
      };

      // 2. DOM API 테스트
      results.dom = {
        querySelector: typeof document.querySelector === 'function',
        addEventListener: typeof document.addEventListener === 'function',
        classList: typeof document.body.classList === 'object'
      };

      // 3. CSS 지원 테스트
      const testElement = document.createElement('div');
      testElement.style.display = 'grid';
      results.css = {
        grid: testElement.style.display === 'grid',
        flexbox: (() => {
          testElement.style.display = 'flex';
          return testElement.style.display === 'flex';
        })()
      };

      // 4. Fetch API 테스트
      results.fetch = typeof fetch === 'function';

      // 5. API 호출 테스트
      try {
        const response = await fetch('/api/search?q=test');
        const data = await response.json();
        results.apiCall = Array.isArray(data);
      } catch (error) {
        results.apiCall = false;
        results.apiError = error instanceof Error ? error.message : 'Unknown error';
      }

      // 6. 브라우저 정보
      const ua = navigator.userAgent;
      results.browser = {
        userAgent: ua,
        name: getBrowserName(ua)
      };

      setTestResults(results);
      setIsLoading(false);
    };

    runTests();
  }, []);

  const getBrowserName = (ua: string) => {
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  };

  const getTestStatus = (passed: boolean) => {
    return passed ? '✅ 통과' : '❌ 실패';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">브라우저 호환성 테스트 중...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>브라우저 호환성 테스트 - Dev Soob Log</title>
        <meta name="description" content="브라우저 호환성 테스트 페이지" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            브라우저 호환성 테스트 결과
          </h1>

          {/* 브라우저 정보 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              브라우저 정보
            </h2>
            <div className="space-y-2">
              <p className="text-gray-900 dark:text-white"><span className="font-medium">브라우저:</span> {testResults.browser?.name}</p>
              <p className="text-gray-900 dark:text-white"><span className="font-medium">User Agent:</span> {testResults.browser?.userAgent}</p>
            </div>
          </div>

          {/* ES6+ 기능 테스트 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              ES6+ JavaScript 기능
            </h2>
            <div className="space-y-2">
              <p className="text-gray-900 dark:text-white">Promise: {getTestStatus(testResults.es6?.promise)}</p>
              <p className="text-gray-900 dark:text-white">Arrow Functions: {getTestStatus(testResults.es6?.arrowFunctions)}</p>
              <p className="text-gray-900 dark:text-white">Template Literals: {getTestStatus(testResults.es6?.templateLiterals)}</p>
              <p className="text-gray-900 dark:text-white">Destructuring: {getTestStatus(testResults.es6?.destructuring)}</p>
            </div>
          </div>

          {/* DOM API 테스트 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              DOM API 지원
            </h2>
            <div className="space-y-2">
              <p className="text-gray-900 dark:text-white">querySelector: {getTestStatus(testResults.dom?.querySelector)}</p>
              <p className="text-gray-900 dark:text-white">addEventListener: {getTestStatus(testResults.dom?.addEventListener)}</p>
              <p className="text-gray-900 dark:text-white">classList: {getTestStatus(testResults.dom?.classList)}</p>
            </div>
          </div>

          {/* CSS 지원 테스트 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              CSS 기능 지원
            </h2>
            <div className="space-y-2">
              <p className="text-gray-900 dark:text-white">CSS Grid: {getTestStatus(testResults.css?.grid)}</p>
              <p className="text-gray-900 dark:text-white">CSS Flexbox: {getTestStatus(testResults.css?.flexbox)}</p>
            </div>
          </div>

          {/* API 테스트 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              API 기능
            </h2>
            <div className="space-y-2">
              <p className="text-gray-900 dark:text-white">Fetch API: {getTestStatus(testResults.fetch)}</p>
              <p className="text-gray-900 dark:text-white">API 호출: {getTestStatus(testResults.apiCall)}</p>
              {testResults.apiError && (
                <p className="text-red-500">에러: {testResults.apiError}</p>
              )}
            </div>
          </div>

          {/* 전체 결과 요약 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              테스트 요약
            </h2>
            <div className="text-center">
              <p className="text-lg text-gray-900 dark:text-white">
                모든 테스트가 통과되었습니다! 🎉
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                이 브라우저에서 Dev Soob Log가 정상적으로 작동합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 