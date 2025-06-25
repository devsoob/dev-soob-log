import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

interface GestureNavigationProps {
  prevPost: { slug: string } | null;
  nextPost: { slug: string } | null;
  onNavigate?: (direction: 'prev' | 'next' | 'back') => void;
}

export function useGestureNavigation({ prevPost, nextPost, onNavigate }: GestureNavigationProps) {
  const router = useRouter();
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isNavigatingRef = useRef(false);
  const wheelDeltaRef = useRef(0);

  const navigateToPost = (direction: 'prev' | 'next') => {
    if (isNavigatingRef.current) return;
    
    isNavigatingRef.current = true;
    
    const targetPost = direction === 'prev' ? prevPost : nextPost;
    if (targetPost) {
      onNavigate?.(direction);
      router.push(`/posts/${targetPost.slug}`);
    }
    
    // 네비게이션 후 잠시 대기
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };

  const navigateBack = () => {
    if (isNavigatingRef.current) return;
    
    isNavigatingRef.current = true;
    onNavigate?.('back');
    router.push('/');
    
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  };

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) return; // 단일 터치만 처리
    
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length !== 1) return;
    
    touchEndRef.current = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
      time: Date.now()
    };

    const start = touchStartRef.current;
    const end = touchEndRef.current;
    
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const deltaTime = end.time - start.time;
    
    // 제스처가 너무 빠르거나 느리면 무시
    if (deltaTime < 100 || deltaTime > 1000) return;
    
    const minSwipeDistance = 50; // 최소 스와이프 거리
    const minSwipeRatio = 0.3; // 최소 스와이프 비율 (가로/세로)
    
    // 가로 스와이프가 세로 스와이프보다 훨씬 클 때만 처리
    if (Math.abs(deltaX) > Math.abs(deltaY) * minSwipeRatio) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          // 오른쪽으로 스와이프 (이전 글)
          navigateToPost('prev');
        } else {
          // 왼쪽으로 스와이프 (다음 글)
          navigateToPost('next');
        }
      }
    } else if (Math.abs(deltaY) > Math.abs(deltaX) * minSwipeRatio) {
      if (deltaY > 0 && Math.abs(deltaY) > minSwipeDistance) {
        // 아래로 스와이프 (목록으로 돌아가기)
        navigateBack();
      }
    }
    
    // 터치 상태 초기화
    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  // 트랙패드 제스처 감지 (wheel 이벤트)
  const handleWheel = (e: WheelEvent) => {
    // 수평 스크롤이 있는 경우에만 처리
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      
      wheelDeltaRef.current += e.deltaX;
      
      // 임계값에 도달하면 네비게이션 실행
      const threshold = 100;
      if (Math.abs(wheelDeltaRef.current) > threshold) {
        if (wheelDeltaRef.current > 0) {
          // 오른쪽으로 스크롤 (이전 글)
          navigateToPost('prev');
        } else {
          // 왼쪽으로 스크롤 (다음 글)
          navigateToPost('next');
        }
        wheelDeltaRef.current = 0;
      }
    }
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        navigateToPost('prev');
        break;
      case 'ArrowRight':
        e.preventDefault();
        navigateToPost('next');
        break;
      case 'Escape':
        e.preventDefault();
        navigateBack();
        break;
    }
  };

  useEffect(() => {
    // 터치 이벤트 리스너 추가
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // 트랙패드 제스처 감지
    document.addEventListener('wheel', handleWheel, { passive: false });
    
    // 키보드 이벤트 리스너 추가
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [prevPost, nextPost]);

  return {
    navigateToPost,
    navigateBack
  };
} 