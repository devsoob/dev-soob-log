import { useState } from 'react';
import { UnifiedPost } from '@/types/post';

interface ShareButtonsProps {
  post: UnifiedPost;
}

export default function ShareButtons({ post }: ShareButtonsProps) {

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
        // 공유 실패 시 아무것도 하지 않음
        console.log('공유 실패');
      });
    } else {
      // 데스크톱에서는 아무것도 하지 않음
      console.log('데스크톱에서는 공유 기능을 지원하지 않습니다');
    }
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(`${window.location.origin}/posts/${post.slug}`);
    const title = encodeURIComponent(post.title);
    const summary = encodeURIComponent(post.description);
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=500');
  };

  return (
    <div className="flex items-center space-x-2 mt-4">
      
      {/* 카카오톡 - 공식 브랜드 아이콘 */}
      <button
        onClick={shareToKakao}
        className="p-3 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="카카오톡으로 공유"
        title="카카오톡으로 공유"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"/>
        </svg>
      </button>

      {/* LinkedIn - 공식 브랜드 아이콘 */}
      <button
        onClick={shareToLinkedIn}
        className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="LinkedIn으로 공유"
        title="LinkedIn으로 공유"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </button>
    </div>
  );
} 