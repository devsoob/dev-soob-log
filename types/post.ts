// 공통 포스트 인터페이스
export interface BasePost {
  id: string;
  title: string;
  content: string;
  date: string;
  slug: string;
  category: string;
  excerpt?: string;
  tags: string[];
  status: PostStatus;
  isPublished: boolean;
  lastModified: string;
  description: string;
}

// 통합된 포스트 타입
export interface UnifiedPost extends BasePost {
  source: PostSource;
}

// 포스트 소스 타입
export type PostSource = 'notion' | 'markdown';

// 포스트 상태 타입
export type PostStatus = 'draft' | 'published' | 'archived';

// 검색 결과 포스트 타입
export interface SearchResultPost {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  score: number;
}

// 검색 결과 타입
export interface SearchResult {
  posts: SearchResultPost[];
  totalCount: number;
  searchTerm: string;
}

// Notion API 관련 타입들
export interface NotionPost {
  id: string;
  properties: NotionPostProperties;
  last_edited_time: string;
}

export interface NotionPostProperties {
  Title: {
    type: 'title';
    title: Array<{ plain_text: string }>;
  };
  Date?: {
    type: 'date';
    date: { start: string };
  };
  Category?: {
    type: 'select';
    select: { name: string };
  };
  Tags?: {
    type: 'multi_select';
    multi_select: Array<{ name: string }>;
  };
  Status?: {
    type: 'select';
    select: { name: string };
  };
  Published?: {
    type: 'checkbox';
    checkbox: boolean;
  };
  Description?: {
    type: 'rich_text';
    rich_text: Array<{ plain_text: string }>;
  };
}

// 마크다운 포스트 타입
export interface MarkdownPost {
  title: string;
  date: string;
  category: string;
  tags: string[];
  content: string;
  slug: string;
  status: string;
  isPublished: boolean;
  description: string;
}

// 작성자 정보
export interface Author {
  name: string;
  picture: string;
}

// 포스트 카드용 간소화된 타입
export interface PostCard {
  slug: string;
  title: string;
  date: string;
  author: Author;
  coverImage?: string;
  excerpt: string;
  content?: string;
  tags?: string[];
}

// 페이지네이션 타입
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  postsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
} 