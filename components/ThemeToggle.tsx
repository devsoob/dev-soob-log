import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // 초기 테마 설정
    if (typeof window !== 'undefined') {
      if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      } else {
        setTheme('light');
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    setIsAnimating(true);
    if (theme === 'light') {
      setTheme('dark');
      localStorage.theme = 'dark';
      document.documentElement.classList.add('dark');
      // storage 이벤트 발생시켜 Giscus가 테마 변경을 감지하도록 함
      window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'dark' }));
    } else {
      setTheme('light');
      localStorage.theme = 'light';
      document.documentElement.classList.remove('dark');
      // storage 이벤트 발생시켜 Giscus가 테마 변경을 감지하도록 함
      window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'light' }));
    }
    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 xs:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors duration-200"
      aria-label="Toggle theme"
    >
      <div className={`relative w-5 h-5 xs:w-6 xs:h-6 transition-transform duration-500 ${isAnimating ? 'rotate-180' : ''}`}>
        {theme === 'light' ? (
          // Crescent moon icon for light mode
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 xs:w-6 xs:h-6 text-black dark:text-white absolute inset-0 transition-opacity duration-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
              transform="scale(-1, 1) translate(-24, 0)"
            />
          </svg>
        ) : (
          // Sun icon for dark mode
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 xs:w-6 xs:h-6 text-black dark:text-white absolute inset-0 transition-opacity duration-300"
          >
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <line x1="12" y1="2" x2="12" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="12" y1="20" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="2" y1="12" x2="4" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="20" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </div>
    </button>
  );
} 