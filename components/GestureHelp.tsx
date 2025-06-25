import { useState, useEffect } from 'react';

export default function GestureHelp() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 이전에 보여줬는지 확인
    const hasShownBefore = localStorage.getItem('gesture-help-shown');
    if (!hasShownBefore) {
      // 3초 후에 안내 표시
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasShown(true);
        localStorage.setItem('gesture-help-shown', 'true');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-40">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            제스처 네비게이션
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <span className="text-lg">←</span>
            <span>왼쪽에서 오른쪽으로 스와이프: 이전 글</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">→</span>
            <span>오른쪽에서 왼쪽으로 스와이프: 다음 글</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">↓</span>
            <span>위에서 아래로 스와이프: 목록으로</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">🖱️</span>
            <span>트랙패드: 좌우 스와이프로 이전/다음</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">⌨️</span>
            <span>키보드: ← → (이전/다음), ESC (목록)</span>
          </div>
        </div>
      </div>
    </div>
  );
} 