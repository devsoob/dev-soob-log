import React from 'react';
import { UnifiedPost } from '@/types/post';
import Link from 'next/link';
import { formatDate, truncateText } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

interface PostCardProps {
  post: UnifiedPost;
  maxDescriptionLength?: number;
}

function PostCard({ post, maxDescriptionLength = 150 }: PostCardProps) {
  const formattedDate = React.useMemo(() => formatDate(post.date), [post.date]);
  const truncatedDescription = React.useMemo(
    () => truncateText(post.description || post.excerpt || '', maxDescriptionLength),
    [post.description, post.excerpt, maxDescriptionLength]
  );

  return (
    <Link href={`${ROUTES.posts}/${post.slug}`} className="block group">
      <article className="relative p-4 xs:p-5 sm:p-6 rounded-xl bg-white dark:bg-[#1a1a1a] hover:shadow-md hover:-translate-y-1 transition-all duration-200">
        {/* 카테고리 */}
        <span className="inline-block text-xs xs:text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          {post.category}
        </span>
        
        {/* 제목 */}
        <h2 className="text-lg xs:text-xl sm:text-2xl font-bold mb-3 text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200">
          {post.title}
        </h2>
        
        {/* 설명 */}
        <p className="text-gray-600 dark:text-gray-400 text-sm xs:text-base sm:text-lg mb-4 line-clamp-2">
          {truncatedDescription}
        </p>
        
        {/* 태그 및 날짜 */}
        <div className="flex items-center justify-between mt-6">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag} 
                  className="text-xs xs:text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs xs:text-sm text-gray-400 dark:text-gray-500">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}
          
          <time className="text-xs xs:text-sm text-gray-400 dark:text-gray-500">
            {formattedDate}
          </time>
        </div>
      </article>
    </Link>
  );
}

export default React.memo(PostCard); 