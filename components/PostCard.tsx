import React from 'react';
import { useRouter } from 'next/router';
import { UnifiedPost } from '@/types/post';
import Tag from './Tag';

interface PostCardProps {
  post: UnifiedPost;
}

function formatDate(date: string) {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return '날짜 없음';
    }
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '/').replace(/\s/g, '').replace(/\/$/, '');
  } catch (error) {
    console.error('Date formatting error:', error);
    return '날짜 없음';
  }
}

function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const formattedDate = React.useMemo(() => formatDate(post.date), [post.date]);

  const handleClick = () => {
    router.push(`/posts/${post.slug}`);
  };

  return (
    <div 
      className="block border border-black dark:border-white rounded-lg mb-4 cursor-pointer"
      onClick={handleClick}
    >
      <div className="p-6">
        <article>
          <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">{post.title}</h2>
          <div className="text-black dark:text-white text-sm mb-3">
            {formattedDate}
          </div>
          <p className="text-black dark:text-white mb-4">{post.description}</p>
        </article>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
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