import Link from 'next/link';
import { UnifiedPost } from '@/types/post';

interface RelatedPostCardProps {
  post: UnifiedPost;
}

export default function RelatedPostCard({ post }: RelatedPostCardProps) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block w-full text-left p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
    >
      <div className="space-y-3">
        {/* 제목 */}
        <h4 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors line-clamp-2">
          {post.title}
        </h4>
        
        {/* 설명 */}
        {post.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {post.description}
          </p>
        )}
        
        {/* 하단 정보 */}
        <div className="flex items-center justify-between">
          {/* 카테고리와 날짜 */}
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">{post.category}</span>
            <span>•</span>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </time>
          </div>
          
          {/* 태그 (최대 2개) */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-1">
              {post.tags.slice(0, 2).map((tag) => (
                <span 
                  key={tag} 
                  className="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 2 && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  +{post.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
} 