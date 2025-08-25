import { UnifiedPost } from '@/types/post';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Client } from '@notionhq/client';

// In-memory TTL cache for posts to avoid redundant Notion/FS reads
type CacheEntry<T> = { data: T; timestamp: number };
const postsCache: Map<string, CacheEntry<any>> = new Map();
const POSTS_CACHE_TTL_MS = 1000 * 60 * 5; // 5 minutes

function readCache<T>(key: string): T | null {
  const entry = postsCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > POSTS_CACHE_TTL_MS) {
    postsCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function writeCache<T>(key: string, data: T): void {
  postsCache.set(key, { data, timestamp: Date.now() });
}

// Notion 클라이언트 초기화
const notion = process.env.NOTION_API_KEY ? new Client({
  auth: process.env.NOTION_API_KEY,
}) : null;

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

// Notion API에서 포스트 가져오기
async function getAllNotionPosts(): Promise<UnifiedPost[]> {
  if (!notion || !DATABASE_ID) {
    console.warn('Notion API not configured. Set NOTION_API_KEY and NOTION_DATABASE_ID in .env.local');
    return [];
  }

  try {
    console.log('Fetching Notion posts...');
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    });
    console.log('Notion API response received');

    const posts: UnifiedPost[] = [];

    for (const page of response.results) {
      if ('properties' in page) {
        const properties = page.properties;
        
        // 필수 속성 확인
        const title = properties.Title?.type === 'title' && Array.isArray(properties.Title.title) ? 
          properties.Title.title[0]?.plain_text || '' : '';
        const date = properties.Date?.type === 'date' ? 
          properties.Date.date?.start || '' : '';
        
        if (!title || !date) {
          console.warn(`Skipping Notion page ${page.id}: missing required fields`);
          continue;
        }

        // 다른 속성들 추출
        const status = properties.Status?.type === 'status' && properties.Status.status && 'name' in properties.Status.status ? 
          properties.Status.status.name || 'Draft' : 'Draft';
        const category = properties.Category?.type === 'select' && properties.Category.select && 'name' in properties.Category.select ? 
          properties.Category.select.name || 'Uncategorized' : 'Uncategorized';
        const tags = properties.Tags?.type === 'multi_select' && Array.isArray(properties.Tags.multi_select) ? 
          properties.Tags.multi_select.map((tag: any) => tag.name) : [];
        const description = properties.Description?.type === 'rich_text' && Array.isArray(properties.Description.rich_text) ? 
          properties.Description.rich_text[0]?.plain_text || '' : '';
        const isPublished = properties.Published?.type === 'checkbox' ? 
          Boolean(properties.Published.checkbox) : false;

        // 페이지 내용 가져오기
        const content = await getNotionPageContent(page.id);
        
        // slug 생성 (제목을 기반으로)
        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9가-힣]/gi, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');

        const post: UnifiedPost = {
          id: page.id,
          slug: `notion-${slug}`,
          title,
          date,
          lastModified: 'last_edited_time' in page ? page.last_edited_time : date,
          category,
          tags,
          keywords: tags, // Notion에서는 tags를 keywords로도 사용
          content,
          status,
          isPublished,
          description
        };

        posts.push(post);
      }
    }

    return posts;
  } catch (error) {
    console.error('Error fetching Notion posts:', error);
    return [];
  }
}

// Notion 페이지 내용 가져오기
async function getNotionPageContent(pageId: string): Promise<string> {
  if (!notion) return '';

  try {
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
    });

    // 간단한 블록 텍스트 추출 (실제로는 더 복잡한 변환이 필요)
    let content = '';
    for (const block of blocks.results) {
      if ('type' in block) {
        switch (block.type) {
          case 'paragraph':
            if (block.paragraph?.rich_text) {
              content += block.paragraph.rich_text.map(text => text.plain_text).join('') + '\n\n';
            }
            break;
          case 'heading_1':
            if (block.heading_1?.rich_text) {
              content += '# ' + block.heading_1.rich_text.map(text => text.plain_text).join('') + '\n\n';
            }
            break;
          case 'heading_2':
            if (block.heading_2?.rich_text) {
              content += '## ' + block.heading_2.rich_text.map(text => text.plain_text).join('') + '\n\n';
            }
            break;
          case 'heading_3':
            if (block.heading_3?.rich_text) {
              content += '### ' + block.heading_3.rich_text.map(text => text.plain_text).join('') + '\n\n';
            }
            break;
          case 'bulleted_list_item':
            if (block.bulleted_list_item?.rich_text) {
              content += '- ' + block.bulleted_list_item.rich_text.map(text => text.plain_text).join('') + '\n';
            }
            break;
          case 'numbered_list_item':
            if (block.numbered_list_item?.rich_text) {
              content += '1. ' + block.numbered_list_item.rich_text.map(text => text.plain_text).join('') + '\n';
            }
            break;
          case 'code':
            if (block.code?.rich_text) {
              const language = block.code.language || '';
              const code = block.code.rich_text.map(text => text.plain_text).join('');
              content += '```' + language + '\n' + code + '\n```\n\n';
            }
            break;
        }
      }
    }

    return content;
  } catch (error) {
    console.error(`Error fetching content for page ${pageId}:`, error);
    return '';
  }
}

async function getNotionPublishedPosts(): Promise<UnifiedPost[]> {
  const allPosts = await getAllNotionPosts();
  return allPosts.filter(post => post.isPublished);
}

function getMarkdownPosts(): UnifiedPost[] {
  const postsDirectory = path.join(process.cwd(), 'posts');
  
  // posts 디렉토리가 존재하지 않으면 빈 배열 반환
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const posts: UnifiedPost[] = [];

  for (const fileName of fileNames) {
    // .md 파일만 처리
    if (!fileName.endsWith('.md')) {
      continue;
    }

    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // 필수 필드 검증
    if (!data.title || !data.date) {
      console.warn(`Skipping ${fileName}: missing required fields (title or date)`);
      continue;
    }

    // slug 생성 (파일명에서 .md 제거)
    const slug = fileName.replace(/\.md$/, '');

    const post: UnifiedPost = {
      id: slug, // slug를 id로 사용
      slug,
      title: data.title,
      date: data.date,
      lastModified: data.lastModified || data.date,
      category: data.category || 'Uncategorized',
      tags: data.tags || [],
      keywords: data.keywords || data.tags || [],
      content,
      status: data.status || 'published',
      isPublished: data.isPublished !== false && data.status !== 'draft', // 기본값은 true
      description: data.description || ''
    };

    posts.push(post);
  }

  return posts;
}

export async function getAllPosts(): Promise<UnifiedPost[]> {
  const cached = readCache<UnifiedPost[]>('allPosts');
  if (cached) return cached;

  const [notionPosts, markdownPosts] = await Promise.all([
    getAllNotionPosts(),
    Promise.resolve(getMarkdownPosts())
  ]);

  // 중복 체크를 위한 Map
  const postMap = new Map<string, UnifiedPost>();

  // 마크다운 포스트 먼저 추가
  markdownPosts.forEach((post: UnifiedPost) => {
    postMap.set(post.slug, post);
  });

  // Notion 포스트 추가 (같은 slug가 있으면 더 최신 것으로 업데이트)
  notionPosts.forEach((post: UnifiedPost) => {
    const existing = postMap.get(post.slug);
    if (!existing || new Date(post.lastModified) > new Date(existing.lastModified)) {
      postMap.set(post.slug, post);
    }
  });

  // Map을 배열로 변환하고 날짜순으로 정렬
  const result = Array.from(postMap.values())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  writeCache('allPosts', result);
  return result;
}

// RSS 생성용 동기 버전 (마크다운 포스트만)
export function getAllPostsSync(): Array<{
  title: string;
  date: string;
  slug: string;
  author: { name: string; picture: string };
  excerpt: string;
}> {
  const markdownPosts = getMarkdownPosts();
  const publishedPosts = markdownPosts.filter((post: UnifiedPost) => post.isPublished);
  
  return publishedPosts.map(post => ({
    title: post.title,
    date: post.date,
    slug: post.slug,
    author: {
      name: 'Choi Soobin',
      picture: '/images/default-avatar.png'
    },
    excerpt: post.excerpt || post.content.slice(0, 200) + '...'
  }));
}

export async function getPublishedPosts(): Promise<UnifiedPost[]> {
  const cached = readCache<UnifiedPost[]>('publishedPosts');
  if (cached) return cached;

  const markdownPosts = getMarkdownPosts();
  const filteredMarkdownPosts = markdownPosts.filter((post: UnifiedPost) => post.isPublished);
  const notionPosts = await getNotionPublishedPosts();

  const postMap = new Map<string, UnifiedPost>();

  // 마크다운 포스트 추가
  filteredMarkdownPosts.forEach((post: UnifiedPost) => {
    postMap.set(post.slug, post);
  });

  // Notion 포스트 추가
  notionPosts.forEach((post: UnifiedPost) => {
    const existing = postMap.get(post.slug);
    if (!existing || new Date(post.lastModified) > new Date(existing.lastModified)) {
      postMap.set(post.slug, post);
    }
  });

  const result = Array.from(postMap.values())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  writeCache('publishedPosts', result);
  return result;
}

export function checkDuplicates(posts: UnifiedPost[]): void {
  const slugCounts = new Map<string, number>();
  const titleCounts = new Map<string, number>();

  posts.forEach(post => {
    slugCounts.set(post.slug, (slugCounts.get(post.slug) || 0) + 1);
    titleCounts.set(post.title, (titleCounts.get(post.title) || 0) + 1);
  });

  slugCounts.forEach((count, slug) => {
    if (count > 1) {
      console.warn(`Duplicate slug found: ${slug} (${count} occurrences)`);
    }
  });

  titleCounts.forEach((count, title) => {
    if (count > 1) {
      console.warn(`Duplicate title found: ${title} (${count} occurrences)`);
    }
  });
}

export function getPostBySlug(slug: string): Promise<UnifiedPost | null> {
  return getAllPosts().then(posts => posts.find(post => post.slug === slug) || null);
} 