import { useState } from 'react';
import { UnifiedPost } from '@/types/post';

interface ShareButtonsProps {
  post: UnifiedPost;
}

export default function ShareButtons({ post }: ShareButtonsProps) {
  const [showCopied, setShowCopied] = useState(false);

  const copyToClipboard = async () => {
    const url = `${window.location.origin}/posts/${post.slug}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (error) {
      // 폴백 처리
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  const shareToKakao = () => {
    const url = `${window.location.origin}/posts/${post.slug}`;
    const text = `${post.title}\n\n${post.description}`;
    
    // 카카오톡 앱 공유 (모바일에서만 작동)
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: url
      }).catch(() => {
        // 공유 실패 시 링크 복사로 대체
        copyToClipboard();
      });
    } else {
      // 데스크톱에서는 링크 복사로 대체
      copyToClipboard();
    }
  };

  const shareToTwitter = () => {
    const url = encodeURIComponent(`${window.location.origin}/posts/${post.slug}`);
    const text = encodeURIComponent(`${post.title}\n\n${post.description}`);
    const hashtags = encodeURIComponent('Flutter,앱개발,개발자블로그');
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(`${window.location.origin}/posts/${post.slug}`);
    const title = encodeURIComponent(post.title);
    const summary = encodeURIComponent(post.description);
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=500');
  };

  return (
    <div className="flex items-center space-x-2 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      
      {/* 카카오톡 */}
      <button
        onClick={shareToKakao}
        className="p-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white transition-colors"
        aria-label="카카오톡으로 공유"
        title="카카오톡으로 공유"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"/>
        </svg>
      </button>

      {/* LinkedIn */}
      <button
        onClick={shareToLinkedIn}
        className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        aria-label="LinkedIn으로 공유"
        title="LinkedIn으로 공유"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </button>

      {/* Twitter */}
      <button
        onClick={shareToTwitter}
        className="p-2 rounded-full bg-blue-400 hover:bg-blue-500 text-white transition-colors"
        aria-label="Twitter로 공유"
        title="Twitter로 공유"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      </button>

      {/* 링크 복사 */}
      <button
        onClick={copyToClipboard}
        className={`p-2 rounded-full transition-colors ${
          showCopied 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
        }`}
        aria-label="링크 복사"
        title="링크 복사"
      >
        {showCopied ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
        )}
      </button>
    </div>
  );
} 