import React from 'react';
import { useRouter } from 'next/router';
import { UnifiedPost } from '@/types/post';
import Tag from './Tag';

interface PostCardProps {
  post: UnifiedPost;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\./g, '/').replace(/\s/g, '').replace(/\/$/, '');
}

function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const formattedDate = React.useMemo(() => formatDate(post.date), [post.date]);

  const handleClick = () => {
    router.push(`/posts/${post.slug}`);
  };

  return (
    <div 
      className="block mb-4 cursor-pointer relative max-w-4xl mx-auto"
      onClick={handleClick}
    >
      <div className="p-3 xs:p-4 sm:p-6 pt-4 xs:pt-6 sm:pt-8 pb-4 xs:pb-6 sm:pb-8 px-4 xs:px-6 sm:px-10">
        <div className="absolute top-1 left-1 w-3 h-3 xs:w-4 sm:w-5 xs:h-4 sm:h-5 border-t border-l border-black dark:border-white"></div>
        <div className="absolute bottom-1 right-1 w-3 h-3 xs:w-4 sm:w-5 xs:h-4 sm:h-5 border-b border-r border-black dark:border-white"></div>
        <article>
          <h2 className="text-lg xs:text-xl sm:text-2xl font-bold mb-2 text-black dark:text-white">{post.title}</h2>
          <div className="text-black dark:text-white text-xs mb-3">
            {formattedDate}
          </div>
          <p className="text-black dark:text-white text-xs xs:text-sm sm:text-base mb-4">{post.description}</p>
        </article>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 xs:gap-3 mt-4">
            {post.tags.map((tag) => (
              <Tag key={tag} name={tag} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(PostCard); 