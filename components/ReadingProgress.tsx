import { useState, useEffect } from 'react';

interface ReadingProgressProps {
  className?: string;
}

export default function ReadingProgress({ className = '' }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(scrollPercent, 100));
      setIsVisible(scrollTop > 50);
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div 
      className={`fixed top-16 left-0 w-full z-40 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      <div 
        className="h-1 bg-gradient-to-r from-blue-400/70 to-purple-400/70 dark:from-blue-500/50 dark:to-purple-500/50 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
} 