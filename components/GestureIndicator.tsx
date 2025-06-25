import { useEffect, useState } from 'react';

interface GestureIndicatorProps {
  direction: 'prev' | 'next' | 'back' | null;
  isVisible: boolean;
}

export default function GestureIndicator({ direction, isVisible }: GestureIndicatorProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible || !direction) return null;

  const getIcon = () => {
    switch (direction) {
      case 'prev':
        return '←';
      case 'next':
        return '→';
      case 'back':
        return '↑';
      default:
        return '';
    }
  };

  const getText = () => {
    switch (direction) {
      case 'prev':
        return '이전 글';
      case 'next':
        return '다음 글';
      case 'back':
        return '목록으로';
      default:
        return '';
    }
  };

  return (
    <div className={`fixed inset-0 pointer-events-none z-50 flex items-center justify-center transition-opacity duration-300 ${
      isAnimating ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="bg-black/80 text-white px-6 py-4 rounded-lg flex items-center space-x-3 backdrop-blur-sm">
        <span className="text-2xl">{getIcon()}</span>
        <span className="text-sm font-medium">{getText()}</span>
      </div>
    </div>
  );
} 