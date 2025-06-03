export interface UnifiedPost {
  id: string;
  title: string;
  content: string;
  date: string;
  source: 'notion' | 'markdown';
  slug: string;
  category: string;
  excerpt?: string;
  tags: string[];
  status: string;
  isPublished: boolean;
  lastModified: string;
  description: string;
}

export interface NotionPost {
  id: string;
  properties: {
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
  };
  last_edited_time: string;
}

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