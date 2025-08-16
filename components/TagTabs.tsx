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

  return (
    <div className="mb-8">
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="-mb-px flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          <Link
            href="/"
            className={`whitespace-nowrap px-4 py-3 border-b-2 font-medium text-base min-h-[44px] flex items-center ${
              !currentTag
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            All
          </Link>
          {tags.map((tag) => (
            <Link
              key={tag.name}
              href={`/?tag=${tag.name}`}
              className={`whitespace-nowrap px-4 py-3 border-b-2 font-medium text-base min-h-[44px] flex items-center ${
                currentTag === tag.name
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
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

// Add this to your global CSS or a new style module
const styles = `
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}
`; 