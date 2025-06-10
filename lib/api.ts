import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post } from '../types/post';

const postsDirectory = path.join(process.cwd(), 'posts');

type PostField = keyof Post;

export function getAllPosts(fields: PostField[] = []): Partial<Post>[] {
  const slugs = fs.readdirSync(postsDirectory);
  const posts = slugs
    .filter(slug => slug.endsWith('.mdx') || slug.endsWith('.md'))
    .map(slug => getPostBySlug(slug, fields))
    .sort((post1, post2) => {
      if (!post1.date || !post2.date) return 0;
      return post1.date > post2.date ? -1 : 1;
    });
  return posts;
}

export function getPostBySlug(slug: string, fields: PostField[] = []): Partial<Post> {
  const realSlug = slug.replace(/\.mdx?$/, '');
  const fullPath = path.join(postsDirectory, slug);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const items: Partial<Post> = {};

  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug;
    }
    if (field === 'content') {
      items[field] = content;
    }
    if (field === 'author' && typeof data[field] === 'object') {
      items[field] = {
        name: data[field].name || 'Anonymous',
        picture: data[field].picture || '/images/default-avatar.png'
      };
    }
    if (typeof data[field] !== 'undefined' && field !== 'author') {
      items[field] = data[field];
    }
  });

  return items;
} 