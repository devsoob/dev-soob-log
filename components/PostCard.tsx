import React from 'react';
import Link from 'next/link';
import { UnifiedPost } from '@/types/post';

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
  const formattedDate = React.useMemo(() => formatDate(post.date), [post.date]);

  return (
    <Link 
      href={`/posts/${post.slug}`}
      className="block border rounded-lg p-6 mb-4 hover:shadow-lg transition-shadow"
      prefetch={true}
    >
      <article>
        <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
        <div className="text-gray-600 text-sm mb-3">
          {formattedDate}
        </div>
        <p className="text-gray-600">{post.description}</p>
      </article>
    </Link>
  );
}

export default React.memo(PostCard); 