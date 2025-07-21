import { NextApiRequest, NextApiResponse } from 'next';
import { getPublishedPosts } from '@/lib/posts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    // 모든 게시물 가져오기 (노션 + 마크다운)
    const allPosts = await getPublishedPosts();
    
    // 검색어로 필터링 (제목과 설명만)
    const searchResults = allPosts.filter(post => {
      const searchTerm = q.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(searchTerm);
      const matchDescription = post.description?.toLowerCase().includes(searchTerm) || false;

      return matchTitle || matchDescription;
    }).map(post => ({
      slug: post.slug,
      title: post.title,
      description: post.description || '',
      date: post.date,
      category: post.category,
      tags: post.tags,
    }));

    console.log('Search results:', searchResults);
    res.status(200).json(searchResults);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search posts' });
  }
} 