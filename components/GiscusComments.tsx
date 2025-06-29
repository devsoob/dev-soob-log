'use client';

import { useEffect, useRef, useState } from 'react';
import Giscus from '@giscus/react';

interface GiscusCommentsProps {
  postSlug: string;
  postTitle: string;
}

export default function GiscusComments({ postSlug, postTitle }: GiscusCommentsProps) {
  const giscusRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // 초기 테마 설정 - ThemeToggle과 동일한 로직 사용
    const checkTheme = () => {
      if (typeof window !== 'undefined') {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          setTheme('dark');
        } else {
          setTheme('light');
        }
      }
    };
    
    checkTheme();

    // storage 이벤트 리스너 추가 (ThemeToggle에서 발생시키는 커스텀 이벤트 포함)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'theme') {
        const newTheme = event.newValue === 'dark' ? 'dark' : 'light';
        setTheme(newTheme);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // prefers-color-scheme 변경 감지
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkTheme);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', checkTheme);
    };
  }, []);

  useEffect(() => {
    // Giscus가 로드된 후 스크롤 위치 조정
    const handleGiscusLoad = () => {
      if (giscusRef.current) {
        const giscusFrame = giscusRef.current.querySelector('iframe');
        if (giscusFrame) {
          giscusFrame.style.minHeight = '400px';
        }
      }
    };
    // MutationObserver로 Giscus iframe 감지
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const iframe = giscusRef.current?.querySelector('iframe');
          if (iframe) {
            handleGiscusLoad();
            observer.disconnect();
          }
        }
      });
    });
    if (giscusRef.current) {
      observer.observe(giscusRef.current, { childList: true, subtree: true });
    }
    return () => observer.disconnect();
  }, [postSlug]);

  // GitHub 저장소 정보 (환경변수로 관리 예정)
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO || '123456soobin-choi/dev-log';
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID || '';
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY || 'Announcements';
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || '';

  // 디버깅을 위한 콘솔 로그
  useEffect(() => {
    console.log('Giscus 환경 변수 확인:', {
      repo,
      repoId,
      category,
      categoryId,
      hasRepoId: !!repoId,
      hasCategoryId: !!categoryId
    });
  }, [repo, repoId, category, categoryId]);

  // 설정값이 없으면 로딩 중 표시
  if (!repoId || !categoryId) {
    return (
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            댓글
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            GitHub Discussions 설정 중입니다...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          댓글
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          GitHub 계정으로 로그인하여 댓글을 남겨주세요.
        </p>
      </div>
      <div 
        ref={giscusRef} 
        className="giscus-container"
      >
        <Giscus
          repo={repo as `${string}/${string}`}
          repoId={repoId}
          category={category}
          categoryId={categoryId}
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={theme}
          lang="ko"
          loading="lazy"
          key={theme + postSlug}
        />
      </div>
    </div>
  );
} 