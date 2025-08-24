import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ProfileCard from './ProfileCard';

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
      <div className="sticky top-0">
        <ProfileCard />
        <div className="p-6 bg-primary rounded-lg border border-primary">
          <h2 className="text-lg font-semibold mb-4 text-primary">Categories</h2>
          <nav>
            <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className={`block px-4 py-3 rounded-md transition-colors min-h-[44px] flex items-center ${
                  !currentCategory
                    ? 'bg-accent text-link'
                    : 'text-secondary hover:bg-tertiary'
                }`}
              >
                All Posts
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.name}>
                <Link
                  href={`/?category=${category.name}`}
                  className={`block px-4 py-3 rounded-md transition-colors min-h-[44px] flex items-center ${
                    currentCategory === category.name
                      ? 'bg-accent text-link'
                      : 'text-secondary hover:bg-tertiary'
                  }`}
                >
                  <span className="flex justify-between items-center w-full">
                    <span className="text-base">{category.name}</span>
                    <span className="text-base text-tertiary">{category.count}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 