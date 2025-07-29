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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 480);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-[#1a1a1a]/80 z-[100]" role="banner">
      <div className="w-full flex justify-between items-center px-4 xs:px-8 h-14 xs:h-16">
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