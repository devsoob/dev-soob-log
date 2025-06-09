import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-black z-50 border-b border-black dark:border-white">
      <div className="max-w-4xl mx-auto px-4 h-16 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-black dark:text-white">
          Dev Log
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
} 