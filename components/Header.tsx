import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ThemeToggle from './ThemeToggle';
import SearchIcon from './icons/SearchIcon';
import RssIcon from './icons/RssIcon';

export default function Header() {
  const [isMobile, setIsMobile] = useState(true);
  const router = useRouter();
  const isHomePage = router.pathname === '/';
  const isPostPage = router.pathname.startsWith('/posts/');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 480);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="fixed w-full top-0 z-50 bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm">
      <div className={`mx-auto px-4 sm:px-6 h-16 flex items-center justify-between ${isHomePage ? 'max-w-7xl lg:px-8' : isPostPage ? 'max-w-6xl lg:px-8' : 'max-w-4xl lg:px-0'}`}>
        <Link href="/" className="text-xl xs:text-2xl font-bold italic hover:scale-105 transition-transform duration-200 text-black dark:text-white" aria-label="Dev Soob Log - Home">
          Dev Soob Log
        </Link>
        <nav className="flex items-center space-x-1 xs:space-x-2">
          {isHomePage && (
            <Link
              href="/search"
              className="p-1.5 xs:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors duration-200"
              aria-label="검색 페이지로 이동"
            >
              <SearchIcon className="text-black dark:text-white xs:w-5 xs:h-5" aria-hidden="true" />
            </Link>
          )}
          <ThemeToggle />
          <Link
            href="/rss.xml"
            className="p-1.5 xs:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors duration-200"
            aria-label="RSS Feed"
            target="_blank"
            rel="noopener noreferrer"
          >
            <RssIcon className="text-black dark:text-white xs:w-5 xs:h-5" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  );
} 