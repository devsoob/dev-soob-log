import { UnifiedPost } from '@/types/post';
import { getPublishedPosts as getNotionPublishedPosts, getAllPosts as getAllNotionPosts } from './notion';
import { getMarkdownPosts } from './markdown';

export async function getAllPosts(): Promise<UnifiedPost[]> {
  const [notionPosts, markdownPosts] = await Promise.all([
    getAllNotionPosts(),
    getMarkdownPosts()
  ]);

  // 중복 체크를 위한 Map
  const postMap = new Map<string, UnifiedPost>();

  // 마크다운 포스트 먼저 추가
  markdownPosts.forEach((post: UnifiedPost) => {
    postMap.set(post.slug, post);
  });

  // Notion 포스트 추가 (같은 slug가 있으면 더 최신 것으로 업데이트)
  notionPosts.forEach((post: UnifiedPost) => {
    const existing = postMap.get(post.slug);
    if (!existing || new Date(post.lastModified) > new Date(existing.lastModified)) {
      postMap.set(post.slug, post);
    }
  });

  // Map을 배열로 변환하고 날짜순으로 정렬
  return Array.from(postMap.values())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPublishedPosts(): Promise<UnifiedPost[]> {
  const markdownPosts = await getMarkdownPosts();
  const filteredMarkdownPosts = markdownPosts.filter((post: UnifiedPost) => post.isPublished);
  const notionPosts = await getNotionPublishedPosts();

  const postMap = new Map<string, UnifiedPost>();

  // 마크다운 포스트 추가
  filteredMarkdownPosts.forEach((post: UnifiedPost) => {
    postMap.set(post.slug, post);
  });

  // Notion 포스트 추가
  notionPosts.forEach((post: UnifiedPost) => {
    const existing = postMap.get(post.slug);
    if (!existing || new Date(post.lastModified) > new Date(existing.lastModified)) {
      postMap.set(post.slug, post);
    }
  });

  return Array.from(postMap.values())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function checkDuplicates(posts: UnifiedPost[]): void {
  const slugCounts = new Map<string, number>();
  const titleCounts = new Map<string, number>();

  posts.forEach(post => {
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

export function getPostBySlug(slug: string): Promise<UnifiedPost | null> {
  return getAllPosts().then(posts => posts.find(post => post.slug === slug) || null);
} 