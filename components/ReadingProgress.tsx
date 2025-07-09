import { useState, useEffect } from 'react';

interface ReadingProgressProps {
  className?: string;
}

export default function ReadingProgress({ className = '' }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // 초기값 설정

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className={`fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-40 ${className}`}>
      <div 
        className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
} 