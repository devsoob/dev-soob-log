import React from 'react';
import { useRouter } from 'next/router';
import { UnifiedPost } from '@/types/post';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate, generatePostImage } from '@/lib/utils';

interface PostCardProps {
  post: UnifiedPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const router = useRouter();
  const currentPage = Number(router.query.page) || 1;

  return (
    <article className="border-b border-gray-200 dark:border-gray-800 last:border-0 pb-8 last:pb-0">
      <Link
        href={{
          pathname: `/posts/${post.slug}`,
          query: { from_page: currentPage }
        }}
        className="group block"
        aria-labelledby={`post-title-${post.slug}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="relative h-36 sm:h-48 md:h-full md:col-span-4 overflow-hidden rounded-lg">
            <Image
              src={generatePostImage(post.title, post.category, post.tags)}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="md:col-span-8">
            <span className="inline-block text-xs xs:text-sm font-medium text-gray-500 dark:text-gray-400 mb-3" 
              role="text" 
              aria-label={`Category: ${post.category}`}
            >
              {post.category}
            </span>
            <h2 
              id={`post-title-${post.slug}`} 
              className="text-lg xs:text-xl sm:text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            >
              {post.title}
            </h2>
            <p className="text-sm xs:text-base text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
              {post.description}
            </p>
            <time 
              className="text-xs xs:text-sm text-gray-500 dark:text-gray-400" 
              dateTime={post.date}
            >
              {formatDate(post.date)}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default PostCard; 