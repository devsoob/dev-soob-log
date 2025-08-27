'use client';

import React, { useState, useEffect } from 'react';
import { TocItem } from './TableOfContents';

interface MobileTableOfContentsProps {
  tocItems: TocItem[];
  activeId?: string;
  onHeadingClick?: (id: string) => void;
  onUpdateActiveId?: (id: string) => void;
}

export default function MobileTableOfContents({ 
  tocItems, 
  activeId: propActiveId, 
  onHeadingClick,
  onUpdateActiveId
}: MobileTableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(100);

  // props로 받은 activeId를 우선 사용
  const activeId = propActiveId !== undefined ? propActiveId : '';

  // 헤더 높이 설정
  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      setHeaderHeight(header.clientHeight + 24);
    }
  }, []);

  // 모달 열림/닫힘에 따라 body 스크롤 제어
  useEffect(() => {
    const handleResize = () => {
      // 화면 크기가 md 이상이 되면 모달을 닫고 스크롤 복원
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // 모달 열림 시 스크롤 방지 (더 안전한 방법)
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      
      // 모달이 열린 후 선택된 목차가 보이도록 스크롤
      setTimeout(() => {
        const activeElement = document.querySelector(`[data-toc-id="${activeId}"]`);
        if (activeElement) {
          activeElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
    } else {
      // 모달 닫힘 시 스크롤 복원
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // 화면 크기 변경 감지
    window.addEventListener('resize', handleResize);

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      window.removeEventListener('resize', handleResize);
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
  }, [isOpen]); // activeId 의존성 제거

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // 모달을 먼저 닫고 스크롤 복원
      setIsOpen(false);
      
      // 스크롤 복원 후 목차로 이동
      setTimeout(() => {
        if (onHeadingClick) {
          onHeadingClick(id);
        }
      }, 300); // 모달 닫힘 애니메이션 완료 후
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <>
      {/* 모바일 목차 버튼 */}
      <button
        onClick={() => {
          // 현재 스크롤 위치 저장
          const currentScrollY = window.scrollY;
          
          // 모달을 열기 전에 현재 스크롤 위치에서 가장 가까운 헤딩 찾기
          const headings = document.querySelectorAll('h1, h2, h3');
          let currentHeading = '';
          
          // 실제 헤더 높이 측정
          const header = document.querySelector('header');
          const headerHeight = header ? header.clientHeight : 80;
          const visibleThreshold = headerHeight + 20; // 헤더 아래 20px 여백
          
          // 현재 화면에 보이는 헤딩 중에서 가장 위에 있는 것을 찾기
          for (let i = 0; i < headings.length; i++) {
            const heading = headings[i];
            const rect = heading.getBoundingClientRect();
            
            // 헤딩이 실제로 보이는 영역(헤더 아래)에 있는 경우
            if (rect.top <= visibleThreshold && rect.bottom > visibleThreshold) {
              currentHeading = heading.id;
              break;
            }
          }
          
          // 위에서 찾지 못했다면, 스크롤 위치를 기준으로 가장 가까운 헤딩 찾기
          if (!currentHeading) {
            let closestHeading = '';
            let minDistance = Infinity;
            
            headings.forEach((heading) => {
              const rect = heading.getBoundingClientRect();
              const distance = Math.abs(rect.top - visibleThreshold);
              if (distance < minDistance) {
                minDistance = distance;
                closestHeading = heading.id;
              }
            });
            
            currentHeading = closestHeading;
          }

          // 현재 스크롤 위치에 해당하는 헤딩이 있으면 activeId 업데이트
          if (currentHeading && currentHeading !== activeId) {
            // 부모 컴포넌트의 activeId를 업데이트하기 위해 onUpdateActiveId 호출
            if (onUpdateActiveId) {
              onUpdateActiveId(currentHeading);
            }
          }

          // 모달 열기
          setIsOpen(true);
        }}
        className="fixed bottom-6 right-6 z-[60] btn-primary p-3 rounded-full shadow-lg transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="목차 열기"
        aria-expanded={isOpen}
        aria-controls="mobile-toc-modal"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>

      {/* 모바일 목차 모달 */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[70] bg-black bg-opacity-50 flex items-end justify-center sm:items-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">목차</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="목차 닫기"
              >
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="overflow-y-auto max-h-[calc(80vh-76px)] p-4" aria-label="목차 네비게이션">
              <ul className="space-y-2" role="list">
                {tocItems.map((item) => (
                  <li key={item.id} role="listitem">
                    <button
                      onClick={() => scrollToHeading(item.id)}
                      className={`text-left w-full px-2 py-2 rounded text-sm transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 min-h-[44px] flex items-center ${
                        activeId === item.id
                          ? 'text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                      }`}
                      style={{
                        paddingLeft: `${(item.level - 1) * 12 + 8}px`
                      }}
                      data-toc-id={item.id}
                      aria-current={activeId === item.id ? 'true' : undefined}
                      aria-label={`${item.text}로 이동`}
                    >
                      {item.text}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}