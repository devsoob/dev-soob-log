import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Tag {
  name: string;
  count: number;
}

interface TagTabsProps {
  tags: Tag[];
}

const TagTabs: React.FC<TagTabsProps> = ({ tags }) => {
  const router = useRouter();
  const currentTag = router.query.tag as string;
  const navRef = React.useRef<HTMLElement>(null);

  // 마우스 휠로 가로 스크롤 처리 (태블릿/웹에서만)
  React.useEffect(() => {
    const element = navRef.current;
    if (!element) return;

    const handleWheel = (e: WheelEvent) => {
      // 모바일에서는 터치 스크롤 사용, 데스크톱에서만 마우스 휠 스크롤
      if (window.innerWidth >= 768) {
        e.preventDefault();
        element.scrollLeft += e.deltaY * 0.5;
      }
    };

    element.addEventListener('wheel', handleWheel, { passive: false });
    return () => element.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="mb-8">
      <div className="relative">
        <nav 
          ref={navRef}
          className="-mb-px flex space-x-4 overflow-x-auto pb-2 scrollbar-hide max-w-full"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
          role="tablist"
          aria-label="포스트 태그 필터"
        >
          <Link
            href="/"
            className={`whitespace-nowrap px-4 py-3 border-b-2 font-medium text-base min-h-[44px] flex items-center flex-shrink-0 transition-colors ${
              !currentTag
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            role="tab"
            aria-selected={!currentTag}
            aria-controls="posts-content"
          >
            All
          </Link>
          {tags.map((tag) => (
            <Link
              key={tag.name}
              href={`/?tag=${tag.name}`}
              className={`whitespace-nowrap px-4 py-3 border-b-2 font-medium text-base min-h-[44px] flex items-center flex-shrink-0 transition-colors ${
                currentTag === tag.name
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              role="tab"
              aria-selected={currentTag === tag.name}
              aria-controls="posts-content"
            >
              {tag.name} ({tag.count})
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TagTabs; 