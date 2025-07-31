export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\./g, '/').replace(/\s/g, '').replace(/\/$/, '');
}

export function generatePostImage(title: string, category: string, tags?: string[]): string {
  // 기술 스택/프레임워크 태그 기반 이미지
  const techImages: Record<string, string> = {
    'React': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    'Next.js': 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=400&fit=crop',
    'Vue': 'https://images.unsplash.com/photo-1607706189992-eae578626c86?w=800&h=400&fit=crop',
    'Angular': 'https://images.unsplash.com/photo-1544982877-f0f4427dee24?w=800&h=400&fit=crop',
    'TypeScript': 'https://images.unsplash.com/photo-1623479322729-28b25c16b011?w=800&h=400&fit=crop',
    'JavaScript': 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop',
    'Flutter': 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&h=400&fit=crop',
    'iOS': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
    'Android': 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&h=400&fit=crop',
    'Python': 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop',
    'Django': 'https://images.unsplash.com/photo-1580121441575-41bcb5c6b47c?w=800&h=400&fit=crop',
    'Node.js': 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=800&h=400&fit=crop'
  };

  // 카테고리별 기본 이미지
  const categoryImages: Record<string, string> = {
    'Frontend': 'https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=800&h=400&fit=crop',
    'Backend': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
    'Mobile': 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800&h=400&fit=crop',
    'DevOps': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
    'Database': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop',
    '트러블슈팅': 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=400&fit=crop',
    '프로젝트': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    '회고': 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=400&fit=crop',
    '알고리즘': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
    'CS': 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=400&fit=crop'
  };

  // 1. 태그 기반으로 이미지 찾기
  if (tags && tags.length > 0) {
    for (const tag of tags) {
      const cleanTag = tag.replace(/[#\s]/g, ''); // '#' 및 공백 제거
      if (techImages[cleanTag]) {
        return techImages[cleanTag];
      }
    }
  }

  // 2. 카테고리 기반으로 이미지 찾기
  if (categoryImages[category]) {
    return categoryImages[category];
  }

  // 3. 기본 이미지 반환
  return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop';
} 