import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Category {
  name: string;
  count: number;
}

interface SidebarProps {
  categories: Category[];
}

const Sidebar: React.FC<SidebarProps> = ({ categories }) => {
  const router = useRouter();
  const currentCategory = router.query.category as string;

  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <div className="sticky top-24 p-6 bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Categories</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className={`block px-3 py-2 rounded-md transition-colors ${
                  !currentCategory
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                All Posts
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.name}>
                <Link
                  href={`/?category=${category.name}`}
                  className={`block px-3 py-2 rounded-md transition-colors ${
                    currentCategory === category.name
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="flex justify-between items-center">
                    <span>{category.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{category.count}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar; 