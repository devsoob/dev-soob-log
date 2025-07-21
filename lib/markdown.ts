import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MarkdownPost, UnifiedPost } from '@/types/post';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getMarkdownPosts(): UnifiedPost[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      const markdownPost: MarkdownPost = {
        title: data.title,
        date: data.date,
        category: data.category || '📚 기술 정리 & 튜토리얼',
        tags: data.tags || [],
        content,
        slug,
        status: data.status || '🚧 작성중',
        isPublished: data.isPublished || false,
        description: data.description || ''
      };

      return convertMarkdownToUnifiedPost(markdownPost);
    });

  return allPostsData;
}

export function convertMarkdownToUnifiedPost(markdownPost: MarkdownPost): UnifiedPost {
  return {
    id: markdownPost.slug,
    title: markdownPost.title,
    content: markdownPost.content,
    date: markdownPost.date,
    source: 'markdown',
    slug: markdownPost.slug,
    category: markdownPost.category,
    tags: markdownPost.tags,
    status: markdownPost.status,
    isPublished: markdownPost.isPublished,
    lastModified: new Date().toISOString(), // For markdown files, we'll use current time
    description: markdownPost.description,
    excerpt: markdownPost.content.slice(0, 200) + '...' // Simple excerpt
  };
} 