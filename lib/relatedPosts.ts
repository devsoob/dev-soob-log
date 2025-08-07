import { UnifiedPost } from '@/types/post';

interface RelatedPostScore {
  post: UnifiedPost;
  score: number;
}

/**
 * 포스트의 관련성을 계산하는 함수
 */
export function calculateRelevanceScore(post: UnifiedPost, currentPost: UnifiedPost): number {
  let score = 0;
  
  // 카테고리가 같으면 높은 점수
  if (post.category === currentPost.category) {
    score += 5;
  }
  
  // 태그 매칭 점수
  if (post.tags && currentPost.tags) {
    post.tags.forEach(tag => {
      if (currentPost.tags.includes(tag)) {
        score += 2;
      }
    });
  }
  
  // 같은 태그가 많을수록 더 높은 점수
  const commonTags = post.tags?.filter(tag => currentPost.tags.includes(tag)) || [];
  score += commonTags.length * 0.5;
  
  return score;
}

/**
 * 현재 포스트와 관련된 포스트들을 찾는 함수
 */
export function findRelatedPosts(
  currentPost: UnifiedPost, 
  allPosts: UnifiedPost[], 
  maxPosts: number = 6
): UnifiedPost[] {
  // 현재 포스트 제외
  const otherPosts = allPosts.filter(post => post.slug !== currentPost.slug);
  
  // 각 포스트의 관련성 점수 계산
  const postsWithScores: RelatedPostScore[] = otherPosts.map(post => ({
    post,
    score: calculateRelevanceScore(post, currentPost)
  }));
  
  // 점수순으로 정렬 (높은 점수 우선)
  postsWithScores.sort((a, b) => b.score - a.score);
  
  // 점수가 0보다 큰 포스트만 필터링하고 최대 개수만큼 반환
  return postsWithScores
    .filter(item => item.score > 0)
    .slice(0, maxPosts)
    .map(item => item.post);
}

/**
 * 태그 기반으로만 관련 포스트를 찾는 함수
 */
export function findRelatedPostsByTags(
  currentPost: UnifiedPost, 
  allPosts: UnifiedPost[], 
  maxPosts: number = 6
): UnifiedPost[] {
  if (!currentPost.tags || currentPost.tags.length === 0) {
    return [];
  }
  
  const otherPosts = allPosts.filter(post => post.slug !== currentPost.slug);
  
  const postsWithScores: RelatedPostScore[] = otherPosts.map(post => {
    let score = 0;
    
    if (post.tags) {
      post.tags.forEach(tag => {
        if (currentPost.tags.includes(tag)) {
          score += 1;
        }
      });
    }
    
    return { post, score };
  });
  
  return postsWithScores
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxPosts)
    .map(item => item.post);
}

/**
 * 카테고리 기반으로만 관련 포스트를 찾는 함수
 */
export function findRelatedPostsByCategory(
  currentPost: UnifiedPost, 
  allPosts: UnifiedPost[], 
  maxPosts: number = 6
): UnifiedPost[] {
  const otherPosts = allPosts.filter(post => 
    post.slug !== currentPost.slug && 
    post.category === currentPost.category
  );
  
  // 날짜순으로 정렬 (최신순)
  return otherPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, maxPosts);
} 