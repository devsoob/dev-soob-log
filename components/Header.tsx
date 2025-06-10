import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-black z-50 border-b border-black/10 dark:border-white/10">
      <div className="w-full h-14 flex justify-between items-center px-5">
        <Link href="/" className="text-lg font-medium text-black dark:text-white">
          Dev Log
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/rss.xml"
            className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
            title="RSS Feed"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 11a9 9 0 0 1 9 9" />
              <path d="M4 4a16 16 0 0 1 16 16" />
              <circle cx="5" cy="19" r="1" />
            </svg>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
} 