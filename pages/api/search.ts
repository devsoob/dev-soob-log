import { NextApiRequest, NextApiResponse } from 'next';
import { getPublishedPosts } from '@/lib/posts';

// 검색 결과를 캐시하기 위한 Map
const searchCache = new Map();
const CACHE_DURATION = 1000 * 60 * 5; // 5분

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchTerm = q.toLowerCase().trim();
    
    // 빈 검색어 처리
    if (searchTerm.length === 0) {
      return res.status(200).json([]);
    }

    // 캐시된 결과가 있는지 확인
    const cacheKey = searchTerm;
    const cachedResult = searchCache.get(cacheKey);
    if (cachedResult && cachedResult.timestamp > Date.now() - CACHE_DURATION) {
      return res.status(200).json(cachedResult.data);
    }

    // 모든 게시물 가져오기 (노션 + 마크다운)
    const allPosts = await getPublishedPosts();
    
    // 검색어로 필터링 (제목과 설명만)
    const searchResults = allPosts
      .filter(post => {
        const matchTitle = post.title.toLowerCase().includes(searchTerm);
        const matchDescription = post.description?.toLowerCase().includes(searchTerm) || false;
        const matchTags = post.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) || false;

        return matchTitle || matchDescription || matchTags;
      })
      .map(post => ({
        slug: post.slug,
        title: post.title,
        description: post.description || '',
        date: post.date,
        category: post.category,
        tags: post.tags,
      }));

    // 결과를 캐시에 저장
    searchCache.set(cacheKey, {
      data: searchResults,
      timestamp: Date.now()
    });

    // 오래된 캐시 정리
    for (const [key, value] of searchCache.entries()) {
      if (value.timestamp <= Date.now() - CACHE_DURATION) {
        searchCache.delete(key);
      }
    }

    res.status(200).json(searchResults);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search posts' });
  }
} 