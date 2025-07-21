import { UnifiedPost, PostStatus } from '@/types/post';
import { getPublishedPosts as getNotionPublishedPosts, getAllPosts as getAllNotionPosts } from './notion';
import { getMarkdownPosts } from './markdown';
import { POST_STATUS } from './constants';
import { safeExecute } from './utils';

/**
 * 포스트 중복 체크 및 병합 함수
 */
function mergePosts(notionPosts: UnifiedPost[], markdownPosts: UnifiedPost[]): UnifiedPost[] {
  const postMap = new Map<string, UnifiedPost>();

  // 마크다운 포스트 먼저 추가
  markdownPosts.forEach((post) => {
    postMap.set(post.slug, post);
  });

  // Notion 포스트 추가 (같은 slug가 있으면 더 최신 것으로 업데이트)
  notionPosts.forEach((post) => {
    const existing = postMap.get(post.slug);
    if (!existing || new Date(post.lastModified) > new Date(existing.lastModified)) {
      postMap.set(post.slug, post);
    }
  });

  return Array.from(postMap.values());
}

/**
 * 포스트를 날짜순으로 정렬하는 함수
 */
function sortPostsByDate(posts: UnifiedPost[]): UnifiedPost[] {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * 모든 포스트를 가져오는 함수
 */
export async function getAllPosts(): Promise<UnifiedPost[]> {
  try {
    const [notionPosts, markdownPosts] = await Promise.all([
      getAllNotionPosts(),
      getMarkdownPosts()
    ]);

    const mergedPosts = mergePosts(notionPosts, markdownPosts);
    return sortPostsByDate(mergedPosts);
  } catch (error) {
    console.error('Failed to fetch all posts:', error);
    return [];
  }
}

/**
 * 게시된 포스트만 가져오는 함수
 */
export async function getPublishedPosts(): Promise<UnifiedPost[]> {
  try {
    const [notionPosts, markdownPosts] = await Promise.all([
      getNotionPublishedPosts(),
      getMarkdownPosts()
    ]);

    // 마크다운 포스트에서 게시된 것만 필터링
    const publishedMarkdownPosts = markdownPosts.filter(
      (post) => post.isPublished && post.status === POST_STATUS.PUBLISHED
    );

    const mergedPosts = mergePosts(notionPosts, publishedMarkdownPosts);
    return sortPostsByDate(mergedPosts);
  } catch (error) {
    console.error('Failed to fetch published posts:', error);
    return [];
  }
}

/**
 * 특정 카테고리의 포스트를 가져오는 함수
 */
export async function getPostsByCategory(category: string): Promise<UnifiedPost[]> {
  try {
    const posts = await getPublishedPosts();
    return posts.filter(
      (post) => post.category.toLowerCase() === category.toLowerCase()
    );
  } catch (error) {
    console.error(`Failed to fetch posts for category ${category}:`, error);
    return [];
  }
}

/**
 * 특정 태그의 포스트를 가져오는 함수
 */
export async function getPostsByTag(tag: string): Promise<UnifiedPost[]> {
  try {
    const posts = await getPublishedPosts();
    const normalizedTag = tag.toLowerCase();
    return posts.filter(
      (post) => post.tags.some((postTag) => postTag.toLowerCase() === normalizedTag)
    );
  } catch (error) {
    console.error(`Failed to fetch posts for tag ${tag}:`, error);
    return [];
  }
}

/**
 * 슬러그로 특정 포스트를 가져오는 함수
 */
export async function getPostBySlug(slug: string): Promise<UnifiedPost | null> {
  try {
    const posts = await getAllPosts();
    return posts.find((post) => post.slug === slug) || null;
  } catch (error) {
    console.error(`Failed to fetch post with slug ${slug}:`, error);
    return null;
  }
}

/**
 * 모든 카테고리를 가져오는 함수
 */
export async function getAllCategories(): Promise<string[]> {
  try {
    const posts = await getPublishedPosts();
    const categories = new Set(posts.map((post) => post.category));
    return Array.from(categories).sort();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

/**
 * 모든 태그를 가져오는 함수
 */
export async function getAllTags(): Promise<string[]> {
  try {
    const posts = await getPublishedPosts();
    const tags = new Set(posts.flatMap((post) => post.tags));
    return Array.from(tags).sort();
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return [];
  }
}

/**
 * 포스트 중복 체크 함수
 */
export function checkDuplicates(posts: UnifiedPost[]): void {
  const slugCounts = new Map<string, number>();
  const titleCounts = new Map<string, number>();

  posts.forEach((post) => {
    slugCounts.set(post.slug, (slugCounts.get(post.slug) || 0) + 1);
    titleCounts.set(post.title, (titleCounts.get(post.title) || 0) + 1);
  });

  slugCounts.forEach((count, slug) => {
    if (count > 1) {
      console.warn(`Duplicate slug found: ${slug} (${count} occurrences)`);
    }
  });

  titleCounts.forEach((count, title) => {
    if (count > 1) {
      console.warn(`Duplicate title found: ${title} (${count} occurrences)`);
    }
  });
}

/**
 * RSS 생성용 동기 버전 (마크다운 포스트만)
 */
export function getAllPostsSync(): Array<{
  title: string;
  date: string;
  slug: string;
  author: { name: string; picture: string };
  excerpt: string;
}> {
  return safeExecute(() => {
    const markdownPosts = getMarkdownPosts();
    const publishedPosts = markdownPosts.filter(
      (post) => post.isPublished && post.status === POST_STATUS.PUBLISHED
    );
    
    return publishedPosts.map((post) => ({
      title: post.title,
      date: post.date,
      slug: post.slug,
      author: {
        name: 'Choi Soobin',
        picture: '/images/default-avatar.png'
      },
      excerpt: post.excerpt || post.content.slice(0, 200) + '...'
    }));
  }, [], 'Failed to get posts for RSS generation');
} 