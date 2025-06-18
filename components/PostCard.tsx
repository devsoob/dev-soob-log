import React from 'react';
import { useRouter } from 'next/router';
import { UnifiedPost } from '@/types/post';
import Tag from './Tag';
import Link from 'next/link';

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
    <Link href={`/posts/${post.slug}`} className="block">
      <div className="relative p-4 xs:p-5 sm:p-6 rounded-xl bg-white dark:bg-[#1a1a1a] hover:shadow-md hover:-translate-y-1 transition-all duration-200">
        <article>
          <span className="inline-block text-xs xs:text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{post.category}</span>
          <h2 className="text-lg xs:text-xl sm:text-2xl font-bold mb-3 text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200">{post.title}</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm xs:text-base sm:text-lg mb-4 line-clamp-2">{post.description}</p>
          <div className="flex items-center justify-between mt-6">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs xs:text-sm text-gray-500 dark:text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <time className="text-xs xs:text-sm text-gray-400 dark:text-gray-500">
              {new Date(post.date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              }).replace(/\./g, '.').replace(/\s/g, '').replace(/\.$/, '')}
            </time>
          </div>
        </article>
      </div>
    </Link>
  );
}

export default React.memo(PostCard); 