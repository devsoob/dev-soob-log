import { useState, useEffect } from 'react';
import { TocItem } from '@/components/TableOfContents';

export function useTableOfContents(tocItems: TocItem[]) {
  const [activeId, setActiveId] = useState<string>('');
  const [headerHeight, setHeaderHeight] = useState(100);

  // 헤더 높이 설정
  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      setHeaderHeight(header.clientHeight + 24);
    }
  }, []);

  // IntersectionObserver를 사용한 스크롤 감지
  useEffect(() => {
    if (tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: `-${headerHeight + 20}px 0px -80% 0px`, // 헤더 높이 + 20px 여백
        threshold: 0
      }
    );

    // 약간의 지연을 두어 DOM이 완전히 렌더링된 후 observer 설정
    const timeoutId = setTimeout(() => {
      tocItems.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          observer.observe(element);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [tocItems, headerHeight]);

  // 목차로 스크롤하는 함수
  const scrollToHeading = (id: string) => {
    setActiveId(id);
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // activeId만 업데이트하는 함수 (스크롤 없이)
  const updateActiveId = (id: string) => {
    setActiveId(id);
  };

  return {
    activeId,
    setActiveId,
    headerHeight,
    scrollToHeading,
    updateActiveId
  };
}
