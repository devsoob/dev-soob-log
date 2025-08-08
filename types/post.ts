export interface UnifiedPost {
  id: string;
  title: string;
  content: string;
  date: string;
  slug: string;
  category: string;
  excerpt?: string;
  tags: string[];
  status: string;
  isPublished: boolean;
  lastModified: string;
  description: string;
}

export interface Author {
  name: string;
  picture: string;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  author: Author;
  coverImage?: string;
  excerpt: string;
  content?: string;
  tags?: string[];
} 