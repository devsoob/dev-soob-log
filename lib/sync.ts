import { UnifiedPost } from '@/types/post';

export interface SyncStatus {
  slug: string;
  title: string;
  notionLastModified?: string;
  markdownLastModified?: string;
  status: 'synced' | 'conflict' | 'notion-only' | 'markdown-only';
}

export function checkSyncStatus(
  notionPosts: UnifiedPost[],
  markdownPosts: UnifiedPost[]
): SyncStatus[] {
  const statusMap = new Map<string, SyncStatus>();

  // Process markdown posts
  markdownPosts.forEach(post => {
    statusMap.set(post.slug, {
      slug: post.slug,
      title: post.title,
      markdownLastModified: post.lastModified,
      status: 'markdown-only'
    });
  });

  // Process notion posts and check for conflicts
  notionPosts.forEach(post => {
    const existing = statusMap.get(post.slug);
    if (!existing) {
      statusMap.set(post.slug, {
        slug: post.slug,
        title: post.title,
        notionLastModified: post.lastModified,
        status: 'notion-only'
      });
    } else {
      const notionDate = new Date(post.lastModified);
      const markdownDate = new Date(existing.markdownLastModified!);
      
      statusMap.set(post.slug, {
        ...existing,
        notionLastModified: post.lastModified,
        status: Math.abs(notionDate.getTime() - markdownDate.getTime()) < 1000 
          ? 'synced' 
          : 'conflict'
      });
    }
  });

  return Array.from(statusMap.values());
}

export function resolveConflict(
  notionPost: UnifiedPost,
  markdownPost: UnifiedPost
): UnifiedPost {
  const notionDate = new Date(notionPost.lastModified);
  const markdownDate = new Date(markdownPost.lastModified);

  if (notionDate > markdownDate) {
    return {
      ...notionPost,
      tags: Array.from(new Set([...notionPost.tags, ...markdownPost.tags])) // Merge tags
    };
  }

  return {
    ...markdownPost,
    tags: Array.from(new Set([...notionPost.tags, ...markdownPost.tags])) // Merge tags
  };
}

export function generateSyncReport(syncStatus: SyncStatus[]): string {
  const conflicts = syncStatus.filter(status => status.status === 'conflict');
  const synced = syncStatus.filter(status => status.status === 'synced');
  const notionOnly = syncStatus.filter(status => status.status === 'notion-only');
  const markdownOnly = syncStatus.filter(status => status.status === 'markdown-only');

  return `
Sync Status Report:
------------------
Total Posts: ${syncStatus.length}
Synced: ${synced.length}
Conflicts: ${conflicts.length}
Notion Only: ${notionOnly.length}
Markdown Only: ${markdownOnly.length}

${conflicts.length > 0 ? `
Conflicts Found:
${conflicts.map(conflict => `- ${conflict.title} (${conflict.slug})`).join('\n')}
` : ''}
`;
} 