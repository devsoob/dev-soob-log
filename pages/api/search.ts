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
      .filter(filename => filename.endsWith('.mdx') || filename.endsWith('.md'))
      .map(filename => {
        const filePath = path.join(postsDirectory, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);
        
        return {
          slug: filename.replace(/\.(mdx?|md)$/, ''),
          title: data.title || '',
          content: content,
          category: data.category || '',
          description: data.description || '',
          tags: data.tags || [],
          data,
        };
      })
      .filter(post => {
        const searchTerm = q.toLowerCase();
        console.log('Checking post:', post.title, 'for term:', searchTerm);
        
        // 각 필드별로 검색어 포함 여부 확인
        const matchTitle = post.title.toLowerCase().includes(searchTerm);
        const matchContent = post.content.toLowerCase().includes(searchTerm);
        const matchCategory = post.category.toLowerCase().includes(searchTerm);
        const matchDescription = post.description.toLowerCase().includes(searchTerm);
        const matchTags = post.tags.some((tag: string) => 
          tag.toLowerCase().includes(searchTerm)
        );

        // 어떤 필드에서 매칭되었는지 로깅
        if (matchTitle || matchContent || matchCategory || matchDescription || matchTags) {
          console.log('Match found in:', {
            title: matchTitle,
            content: matchContent,
            category: matchCategory,
            description: matchDescription,
            tags: matchTags
          });
        }

        return matchTitle || matchContent || matchCategory || matchDescription || matchTags;
      })
      .map(({ slug, title, description, category, tags }) => ({
        slug,
        title,
        excerpt: description || '',
        category,
        tags,
      }));

    console.log('Search results:', searchResults);
    res.status(200).json(searchResults);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search posts' });
  }
} 