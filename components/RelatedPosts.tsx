import { UnifiedPost } from '@/types/post';
import RelatedPostCard from './RelatedPostCard';

interface RelatedPostsProps {
  posts: UnifiedPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          관련 포스트
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          이 글과 관련된 다른 포스트들을 확인해보세요
        </p>
      </div>
      
      <div className="space-y-3">
        {posts.map((post) => (
          <RelatedPostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
} 