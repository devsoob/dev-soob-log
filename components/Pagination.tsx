import React from 'react';
import { PaginationInfo } from '@/types/post';
import { PAGINATION_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({ 
  pagination, 
  onPageChange, 
  className 
}) => {
  const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;

  // 표시할 페이지 번호들을 계산
  const getVisiblePages = (): number[] => {
    if (totalPages <= PAGINATION_CONFIG.maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: number[] = [];
    const halfVisible = Math.floor(PAGINATION_CONFIG.maxVisiblePages / 2);
    
    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, start + PAGINATION_CONFIG.maxVisiblePages - 1);
    
    // 끝에서 시작점 조정
    if (end - start < PAGINATION_CONFIG.maxVisiblePages - 1) {
      start = Math.max(1, end - PAGINATION_CONFIG.maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();

  return (
    <nav className={cn("flex justify-center items-center space-x-2 mt-8", className)}>
      {/* 이전 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className={cn(
          "px-3 py-2 text-sm font-medium rounded-md transition-colors",
          hasPrevPage
            ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            : "text-gray-400 cursor-not-allowed"
        )}
        aria-label="이전 페이지"
      >
        이전
      </button>

      {/* 첫 페이지로 이동 (생략 표시가 있을 때) */}
      {visiblePages[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            1
          </button>
          {visiblePages[0] > 2 && (
            <span className="px-2 text-gray-400">...</span>
          )}
        </>
      )}

      {/* 페이지 번호들 */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            "px-3 py-2 text-sm font-medium rounded-md transition-colors",
            currentPage === page
              ? "bg-blue-600 text-white"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          )}
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      {/* 마지막 페이지로 이동 (생략 표시가 있을 때) */}
      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="px-2 text-gray-400">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* 다음 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={cn(
          "px-3 py-2 text-sm font-medium rounded-md transition-colors",
          hasNextPage
            ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            : "text-gray-400 cursor-not-allowed"
        )}
        aria-label="다음 페이지"
      >
        다음
      </button>
    </nav>
  );
};

export default Pagination; 