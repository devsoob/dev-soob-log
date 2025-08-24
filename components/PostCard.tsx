import React from 'react';
import { useRouter } from 'next/router';
import { UnifiedPost } from '@/types/post';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

interface PostCardProps {
  post: UnifiedPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const router = useRouter();
  const currentPage = Number(router.query.page) || 1;
  const text = post.tags && post.tags.length > 0 ? post.tags[0].replace(/[#\s]/g, '') : post.category;

  return (
    <article className="border-b border-primary last:border-0 pb-8 last:pb-0">
      <Link
        href={{
          pathname: `/posts/${post.slug}`,
          query: { from_page: currentPage }
        }}
        className="group block min-h-[44px] min-w-[44px] p-2 -m-2"
        aria-labelledby={`post-title-${post.slug}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          <div className="relative h-40 sm:h-64 md:h-full md:col-span-4 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800">
            <div className="absolute inset-0 flex items-center justify-center text-lg sm:text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-50">
              {text}
            </div>
          </div>
          <div className="md:col-span-8">
            <span className="inline-block text-base xs:text-lg font-medium text-tertiary mb-2 md:mb-3" 
              role="text" 
              aria-label={`Category: ${post.category}`}
            >
              {post.category}
            </span>
            <h2 
              id={`post-title-${post.slug}`} 
              className="text-lg xs:text-xl sm:text-2xl font-bold mb-2 md:mb-3 text-primary group-hover:text-link transition-colors"
            >
              {post.title}
            </h2>
            <p className="text-base xs:text-lg text-secondary mb-3 md:mb-4 line-clamp-2">
              {post.description}
            </p>
            <time 
              className="text-sm xs:text-base text-tertiary" 
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