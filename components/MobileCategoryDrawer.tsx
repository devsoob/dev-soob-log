import React from 'react';
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

  // 카테고리 선택 시 드로어를 닫습니다
  const handleCategoryClick = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 bottom-0 w-3/4 max-w-xs h-[80vh] bg-white dark:bg-[#1a1a1a] z-50 rounded-tl-2xl shadow-xl transition-transform duration-300 transform md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Categories</h2>
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

        <nav className="p-4 overflow-y-auto h-[calc(100%-64px)]">
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