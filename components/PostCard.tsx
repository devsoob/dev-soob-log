import React from 'react';
import { useRouter } from 'next/router';
import { UnifiedPost } from '@/types/post';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface PostCardProps {
  post: UnifiedPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const router = useRouter();
  const currentPage = Number(router.query.page) || 1;

  return (
    <article className="block">
      <Link
        href={{
          pathname: `/posts/${post.slug}`,
          query: { from_page: currentPage }
        }}
        className="relative p-4 xs:p-5 sm:p-6 rounded-xl bg-white dark:bg-[#1a1a1a] hover:shadow-md hover:-translate-y-1 transition-all duration-200 block"
        aria-labelledby={`post-title-${post.slug}`}
      >
        <div>
          <span className="inline-block text-xs xs:text-sm font-medium text-gray-500 dark:text-gray-400 mb-4" role="text" aria-label={`Category: ${post.category}`}>{post.category}</span>
          <h2 id={`post-title-${post.slug}`} className="text-lg xs:text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            {post.title}
          </h2>
          <p className="text-sm xs:text-base text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {post.description}
          </p>
          <time className="text-xs xs:text-sm text-gray-500 dark:text-gray-400" dateTime={post.date}>
            {formatDate(post.date)}
          </time>
        </div>
      </Link>
    </article>
  );
};

export default PostCard; 