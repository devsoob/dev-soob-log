import { UnifiedPost } from '@/types/post';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

// In-memory TTL cache for posts to avoid redundant Notion/FS reads
type CacheEntry<T> = { data: T; timestamp: number };
const postsCache: Map<string, CacheEntry<any>> = new Map();
// Disable cache to reflect Notion changes immediately in all envs
const POSTS_CACHE_TTL_MS = 0;

function readCache<T>(key: string): T | null {
  const entry = postsCache.get(key);
  if (!entry) return null;
  if (POSTS_CACHE_TTL_MS === 0 || Date.now() - entry.timestamp > POSTS_CACHE_TTL_MS) {
    postsCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function writeCache<T>(key: string, data: T): void {
  if (POSTS_CACHE_TTL_MS === 0) return; // don't cache in dev
  postsCache.set(key, { data, timestamp: Date.now() });
}

// Notion 클라이언트 초기화
const notion = process.env.NOTION_API_KEY ? new Client({
  auth: process.env.NOTION_API_KEY,
}) : null;

const n2m = notion ? new NotionToMarkdown({ notionClient: notion }) : null;

// Customize callout to render as dedicated HTML container to style separately from blockquote
if (n2m) {
  try {
    // @ts-ignore - method exists in notion-to-md
    n2m.setCustomTransformer('callout', async (block: any) => {
      const icon = (block.callout && block.callout.icon && block.callout.icon.type === 'emoji') ? block.callout.icon.emoji : '';
      const richTexts = (block.callout && Array.isArray(block.callout.rich_text)) ? block.callout.rich_text.map((t: any) => t.plain_text).join('') : '';
      return `<div class="notion-callout"><div class="notion-callout-icon">${icon || ''}</div><div class="notion-callout-content">${richTexts}</div></div>`;
    });
  } catch {}
}

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

// Notion API에서 포스트 가져오기
async function getAllNotionPosts(includeContent: boolean = true): Promise<UnifiedPost[]> {
  if (!notion || !DATABASE_ID) {
    console.warn('Notion API not configured. Set NOTION_API_KEY and NOTION_DATABASE_ID in .env.local');
    return [];
  }

  try {
    if (process.env.DEBUG === 'true') console.log('Fetching Notion posts...');
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    });
    if (process.env.DEBUG === 'true') console.log('Notion API response received');

    const posts: UnifiedPost[] = [];

    for (const page of response.results) {
      if ('properties' in page) {
        // Skip archived pages (deleted/archived in Notion)
        if ('archived' in page && page.archived) {
          continue;
        }
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
  if (!notion || !n2m) return '';
  try {
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdBlocks);
    let content = mdString.parent || '';

    // Cleanup: remove wrapping quotes that notion-to-md may add around callouts/quotes
    content = content.replace(/^"\s*|\s*"$/gm, '');

    // Fix task list having extra bullet before checkbox
    content = content.replace(/^\s*[-*]\s*\[(x| )\]/gim, match => match.replace(/^\s*[-*]\s*/, ''));

    // Ensure each task appears on its own line
    content = content.replace(/\s+(- \[(?: |x)\]\s+)/g, '\n$1');

    // Ensure toggle content is indented under its summary
    content = content.replace(/(<details>\s*<summary>[^<]+<\/summary>)\n([^<])/g, (_m, a, b) => `${a}\n\t${b}`);

    return content;
  } catch (error) {
    console.error(`Error fetching content for page ${pageId}:`, error);
    return '';
  }
}

// 외부에서 특정 Notion 페이지의 콘텐츠만 필요할 때 사용
export async function getNotionContentById(pageId: string): Promise<string> {
  return getNotionPageContent(pageId);
}

async function getNotionPublishedPosts(includeContent: boolean = true): Promise<UnifiedPost[]> {
  const allPosts = await getAllNotionPosts(true);
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
    getAllNotionPosts(true),
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
  // 목록에서도 기존처럼 전체 콘텐츠를 포함해 가져옵니다 (요청에 따라 롤백)
  const notionPosts = await getNotionPublishedPosts(true);

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