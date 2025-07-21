import { NextApiRequest, NextApiResponse } from 'next';
import { getPublishedPosts } from '@/lib/posts';
import { SearchResult, SearchResultPost } from '@/types/post';
import { ERROR_MESSAGES } from '@/lib/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q, limit = '10' } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const searchTerm = q.trim().toLowerCase();
    const limitNum = parseInt(limit as string, 10) || 10;

    if (searchTerm.length < 1) {
      return res.status(200).json({
        posts: [],
        totalCount: 0,
        searchTerm: q
      });
    }

    // 모든 게시물 가져오기
    const allPosts = await getPublishedPosts();
    
    // 검색어로 필터링 및 점수 계산
    const searchResults = allPosts
      .map(post => {
        const title = post.title.toLowerCase();
        const description = (post.description || '').toLowerCase();
        const content = post.content.toLowerCase();
        const category = post.category.toLowerCase();
        const tags = post.tags.map(tag => tag.toLowerCase());

        let score = 0;
        const searchWords = searchTerm.split(/\s+/);

        searchWords.forEach(word => {
          // 제목 매칭 (가장 높은 점수)
          if (title.includes(word)) {
            score += 10;
            // 정확한 제목 매칭
            if (title === word) score += 5;
          }

          // 설명 매칭
          if (description.includes(word)) {
            score += 5;
          }

          // 내용 매칭
          if (content.includes(word)) {
            score += 2;
          }

          // 카테고리 매칭
          if (category.includes(word)) {
            score += 3;
          }

          // 태그 매칭
          if (tags.some(tag => tag.includes(word))) {
            score += 4;
          }
        });

        return {
          post,
          score
        };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limitNum)
      .map(result => ({
        slug: result.post.slug,
        title: result.post.title,
        description: result.post.description || '',
        excerpt: result.post.excerpt || '',
        date: result.post.date,
        category: result.post.category,
        tags: result.post.tags,
        score: result.score
      } as SearchResultPost));

    const response: SearchResult = {
      posts: searchResults,
      totalCount: searchResults.length,
      searchTerm: q
    };

    console.log(`Search completed for "${q}": ${searchResults.length} results found`);
    res.status(200).json(response);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      error: ERROR_MESSAGES.searchFailed,
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 