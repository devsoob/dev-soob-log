import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  // 한 번에 보여줄 페이지 수 (예: 5개씩 1-5, 6-10)
  maxVisiblePages?: number;
  // <<, >> 처럼 덩어리 단위 점프 허용
  enableChunkNav?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, maxVisiblePages, enableChunkNav = false }) => {
  const getVisiblePages = () => {
    // 최대 표시 개수가 없으면 전체 페이지 노출 (기존 동작 유지)
    if (!maxVisiblePages || maxVisiblePages <= 0) {
      const allPages = [];
      for (let i = 1; i <= totalPages; i++) {
        allPages.push(i);
      }
      return allPages;
    }

    // 현재 페이지 기준으로 윈도우(덩어리) 계산
    const chunkSize = maxVisiblePages;
    const chunkIndex = Math.floor((currentPage - 1) / chunkSize);
    const start = chunkIndex * chunkSize + 1;
    const end = Math.min(totalPages, start + chunkSize - 1);
    const windowPages = [];
    for (let p = start; p <= end; p++) {
      windowPages.push(p);
    }
    return windowPages;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();
  const chunkSize = maxVisiblePages && maxVisiblePages > 0 ? maxVisiblePages : totalPages;
  const canGoPrevChunk = currentPage > 1;
  const canGoNextChunk = currentPage < totalPages;
  const goPrevChunk = () => onPageChange(Math.max(1, currentPage - chunkSize));
  const goNextChunk = () => onPageChange(Math.min(totalPages, currentPage + chunkSize));

  return (
    <nav aria-label="페이지 네비게이션" className="mt-8">
      <div className="flex justify-center items-center space-x-2">
        {enableChunkNav && (
          <button
            onClick={goPrevChunk}
            disabled={!canGoPrevChunk}
            className={`px-3 py-3 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
              !canGoPrevChunk
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            aria-label={`${chunkSize} 페이지 이전으로`}
            aria-disabled={!canGoPrevChunk}
          >
            <span className="flex items-center -space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </span>
          </button>
        )}

        {/* 이전 페이지 버튼 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-3 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          aria-label="이전 페이지"
          aria-disabled={currentPage === 1}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* 페이지 번호들 */}
        {visiblePages.map((page, index) => (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`px-4 py-3 text-base font-medium rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            aria-label={`${page} 페이지`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        {/* 다음 페이지 버튼 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-3 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          aria-label="다음 페이지"
          aria-disabled={currentPage === totalPages}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {enableChunkNav && (
          <button
            onClick={goNextChunk}
            disabled={!canGoNextChunk}
            className={`px-3 py-3 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
              !canGoNextChunk
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            aria-label={`${chunkSize} 페이지 앞으로`}
            aria-disabled={!canGoNextChunk}
          >
            <span className="flex items-center -space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <div className="sr-only" aria-live="polite">
        현재 {currentPage} 페이지, 전체 {totalPages} 페이지
      </div>
    </nav>
  );
};

export default Pagination; 