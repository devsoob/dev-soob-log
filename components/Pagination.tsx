import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    // 모든 페이지 번호를 배열로 생성
    const allPages = [];
    for (let i = 1; i <= totalPages; i++) {
      allPages.push(i);
    }
    return allPages;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();

  return (
    <nav aria-label="페이지 네비게이션" className="mt-8">
      <div className="flex justify-center items-center space-x-2">
        {/* 이전 페이지 버튼 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-3 text-base font-medium rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          aria-label="이전 페이지"
          aria-disabled={currentPage === 1}
        >
          이전
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
          className={`px-4 py-3 text-base font-medium rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          aria-label="다음 페이지"
          aria-disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
      <div className="sr-only" aria-live="polite">
        현재 {currentPage} 페이지, 전체 {totalPages} 페이지
      </div>
    </nav>
  );
};

export default Pagination; 