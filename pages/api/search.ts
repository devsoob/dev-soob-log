import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const postsDirectory = path.join(process.cwd(), 'posts');
    const filenames = fs.readdirSync(postsDirectory);
    console.log('Found files:', filenames);
    
    const searchResults = filenames
      .filter(filename => filename.endsWith('.mdx'))
      .map(filename => {
        const filePath = path.join(postsDirectory, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);
        
        return {
          slug: filename.replace(/\.mdx$/, ''),
          title: data.title || '',
          excerpt: content.slice(0, 200).trim() + '...',
          content: content.toLowerCase(),
          data,
        };
      })
      .filter(post => {
        const searchTerm = q.toLowerCase();
        console.log('Checking post:', post.title, 'for term:', searchTerm);
        const matches = 
          post.title.toLowerCase().includes(searchTerm) ||
          post.content.includes(searchTerm) ||
          (post.data.tags && post.data.tags.some((tag: string) => 
            tag.toLowerCase().includes(searchTerm)
          ));
        console.log('Matches:', matches);
        return matches;
      })
      .map(({ slug, title, excerpt }) => ({
        slug,
        title,
        excerpt,
      }));

    console.log('Search results:', searchResults);
    res.status(200).json(searchResults);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search posts' });
  }
} 