import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Category {
  name: string;
  count: number;
}

interface MobileCategoryDrawerProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
}

const MobileCategoryDrawer: React.FC<MobileCategoryDrawerProps> = ({
  categories,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const currentCategory = router.query.category as string;

  // 모달 열림/닫힘에 따라 body 스크롤 제어
  useEffect(() => {
    const handleResize = () => {
      // 화면 크기가 md 이상이 되면 모달을 닫고 스크롤 복원
      if (window.innerWidth >= 768 && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      // 모달 열림 시 스크롤 방지
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
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
  }, [isOpen, onClose]);

  // 카테고리 선택 시 드로어를 닫습니다
  const handleCategoryClick = () => {
    // 약간의 지연을 두어 라우팅이 완료된 후 드로어가 닫히도록 합니다
    setTimeout(() => {
      onClose();
    }, 100);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer (bottom sheet) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-category-title"
        className={`fixed inset-x-0 bottom-6 mx-auto w-full max-w-md max-h-[70vh] bg-white dark:bg-[#1a1a1a] z-[70] rounded-2xl shadow-xl transition-transform duration-300 transform md:hidden ${
          isOpen ? 'translate-y-0' : 'translate-y-[120%]'
        }`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h2 id="mobile-category-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">Categories</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4 overflow-y-auto max-h-[calc(70vh-80px)]">
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className={`block px-4 py-2.5 rounded-lg transition-colors ${
                  !currentCategory
                    ? 'bg-accent text-link'
                    : 'text-secondary hover:bg-tertiary'
                }`}
                onClick={handleCategoryClick}
              >
                All Posts
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.name}>
                <Link
                  href={`/?category=${category.name}`}
                  className={`block px-4 py-2.5 rounded-lg transition-colors ${
                    currentCategory === category.name
                      ? 'bg-accent text-link'
                      : 'text-secondary hover:bg-tertiary'
                  }`}
                  onClick={handleCategoryClick}
                >
                  <span className="flex justify-between items-center">
                    <span>{category.name}</span>
                    <span className="text-sm text-tertiary">
                      {category.count}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default MobileCategoryDrawer; 