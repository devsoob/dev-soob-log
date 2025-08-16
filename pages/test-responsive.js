import { useState, useEffect } from 'react';
import Head from 'next/head';

const devices = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 12 Pro', width: 390, height: 844 },
  { name: 'iPhone 12 Pro Max', width: 428, height: 926 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'iPad Pro', width: 1024, height: 1366 },
  { name: 'Samsung Galaxy S20', width: 360, height: 800 },
  { name: 'Samsung Galaxy Tab S7', width: 800, height: 1280 },
  { name: 'Desktop', width: 1920, height: 1080 }
];

const testPages = [
  { path: '/', name: '메인 페이지' },
  { path: '/posts', name: '포스트 목록' },
  { path: '/about', name: '소개 페이지' },
  { path: '/tags', name: '태그 페이지' },
  { path: '/categories', name: '카테고리 페이지' }
];

export default function TestResponsive() {
  const [selectedDevice, setSelectedDevice] = useState(devices[0]);
  const [selectedPage, setSelectedPage] = useState(testPages[0]);
  const [iframeUrl, setIframeUrl] = useState('http://localhost:3000/');
  const [isLoading, setIsLoading] = useState(false);
  const [viewportInfo, setViewportInfo] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setIframeUrl(`http://localhost:3000${selectedPage.path}`);
  }, [selectedPage]);

  useEffect(() => {
    const updateViewport = () => {
      setViewportInfo({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const handleDeviceChange = (device) => {
    setSelectedDevice(device);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handlePageChange = (page) => {
    setSelectedPage(page);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <>
      <Head>
        <title>반응형 테스트 - Dev Soob Log</title>
        <meta name="description" content="다양한 디바이스에서의 반응형 테스트" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              📱 반응형 디자인 테스트
            </h1>
            <p className="text-gray-600">
              다양한 디바이스에서 웹사이트의 반응형 디자인을 테스트해보세요.
            </p>
          </div>

          {/* 컨트롤 패널 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 디바이스 선택 */}
              <div>
                <h3 className="text-lg font-semibold mb-3">📱 디바이스 선택</h3>
                <div className="grid grid-cols-2 gap-2">
                  {devices.map((device) => (
                    <button
                      key={device.name}
                      onClick={() => handleDeviceChange(device)}
                      className={`p-3 text-sm rounded-lg border transition-colors ${
                        selectedDevice.name === device.name
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-medium">{device.name}</div>
                      <div className="text-xs opacity-75">
                        {device.width} × {device.height}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 페이지 선택 */}
              <div>
                <h3 className="text-lg font-semibold mb-3">📄 페이지 선택</h3>
                <div className="grid grid-cols-1 gap-2">
                  {testPages.map((page) => (
                    <button
                      key={page.path}
                      onClick={() => handlePageChange(page)}
                      className={`p-3 text-left rounded-lg border transition-colors ${
                        selectedPage.path === page.path
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-medium">{page.name}</div>
                      <div className="text-xs opacity-75">{page.path}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 현재 설정 정보 */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">현재 설정</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">디바이스:</span>
                  <div className="font-medium">{selectedDevice.name}</div>
                </div>
                <div>
                  <span className="text-gray-600">뷰포트:</span>
                  <div className="font-medium">{selectedDevice.width} × {selectedDevice.height}</div>
                </div>
                <div>
                  <span className="text-gray-600">페이지:</span>
                  <div className="font-medium">{selectedPage.name}</div>
                </div>
                <div>
                  <span className="text-gray-600">URL:</span>
                  <div className="font-medium text-blue-600">{iframeUrl}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 디바이스 프레임 */}
          <div className="flex justify-center">
            <div className="relative">
              {/* 디바이스 프레임 */}
              <div
                className="bg-white rounded-lg shadow-2xl border-8 border-gray-800 relative overflow-hidden"
                style={{
                  width: selectedDevice.width,
                  height: selectedDevice.height,
                  maxWidth: '100vw',
                  maxHeight: '80vh'
                }}
              >
                {/* 디바이스 헤더 */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 flex items-center justify-center z-10">
                  <div className="w-16 h-1 bg-gray-600 rounded-full"></div>
                </div>

                {/* 로딩 인디케이터 */}
                {isLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                )}

                {/* iframe */}
                <iframe
                  src={iframeUrl}
                  className="w-full h-full border-0"
                  style={{ marginTop: '24px' }}
                  title={`${selectedDevice.name} - ${selectedPage.name}`}
                  onLoad={() => setIsLoading(false)}
                />
              </div>

              {/* 디바이스 정보 */}
              <div className="mt-4 text-center">
                <div className="inline-block bg-gray-800 text-white px-4 py-2 rounded-lg">
                  <div className="font-medium">{selectedDevice.name}</div>
                  <div className="text-sm opacity-75">
                    {selectedDevice.width} × {selectedDevice.height}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 현재 뷰포트 정보 */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">🖥️ 현재 브라우저 뷰포트</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{viewportInfo.width}</div>
                <div className="text-sm text-gray-600">너비 (px)</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{viewportInfo.height}</div>
                <div className="text-sm text-gray-600">높이 (px)</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {viewportInfo.width < 768 ? 'Mobile' : viewportInfo.width < 1024 ? 'Tablet' : 'Desktop'}
                </div>
                <div className="text-sm text-gray-600">디바이스 타입</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {(viewportInfo.width / viewportInfo.height).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">종횡비</div>
              </div>
            </div>
          </div>

          {/* 테스트 가이드 */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">🧪 테스트 가이드</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">✅ 확인할 항목</h4>
                <ul className="space-y-1">
                  <li>• 레이아웃이 올바르게 표시되는지</li>
                  <li>• 텍스트가 가독성 있게 보이는지</li>
                  <li>• 버튼과 링크가 터치하기 쉬운지</li>
                  <li>• 네비게이션이 사용하기 편한지</li>
                  <li>• 이미지가 적절한 크기로 표시되는지</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🔧 추가 테스트</h4>
                <ul className="space-y-1">
                  <li>• 브라우저 개발자 도구 사용</li>
                  <li>• 실제 디바이스에서 테스트</li>
                  <li>• 다양한 브라우저에서 확인</li>
                  <li>• 성능 및 로딩 속도 체크</li>
                  <li>• 접근성 테스트</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 