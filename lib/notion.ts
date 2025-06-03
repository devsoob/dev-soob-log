import { Client } from "@notionhq/client";
import { NotionPost, UnifiedPost } from "@/types/post";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

// Notion API 클라이언트를 생성, 인증키는 환경변수로 관리해
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// 제목으로부터 슬러그 생성하는 함수
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9가-힣\s-]/g, '') // 한글, 영문, 숫자, 공백, 하이픈만 허용
    .replace(/\s+/g, '-') // 공백을 하이픈으로 변경
    .replace(/-+/g, '-') // 여러 개의 하이픈을 하나로
    .replace(/^-|-$/g, ''); // 시작과 끝의 하이픈 제거
}

// 데이터베이스 ID를 받아서 Notion 데이터베이스에서 데이터 조회
export async function getDatabaseItems(databaseId: string): Promise<NotionPost[]> {
  try {
    console.log('Fetching database items with ID:', databaseId);
    
    if (!databaseId) {
      throw new Error('Database ID is not defined');
    }

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: "Published",
            checkbox: {
              equals: true
            }
          }
        ]
      }
    });

    console.log('Database response:', JSON.stringify(response, null, 2));
    
    return response.results
      .filter((page): page is PageObjectResponse => 'properties' in page)
      .filter(page => {
        const props = page.properties;
        return (
          'Title' in props &&
          props.Title.type === 'title'
        );
      }) as unknown as NotionPost[];
  } catch (error) {
    console.error('Error fetching database items:', error);
    return [];
  }
}

// 모든 포스트 가져오기 (Published 상관없이)
export async function getAllDatabaseItems(databaseId: string): Promise<NotionPost[]> {
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  
  return response.results
    .filter((page): page is PageObjectResponse => 'properties' in page)
    .filter(page => {
      const props = page.properties;
      return (
        'Title' in props &&
        props.Title.type === 'title'
      );
    }) as unknown as NotionPost[];
}

// Notion 페이지 콘텐츠 가져오기
export async function getPageContent(pageId: string) {
  const blocks = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 100,
  });

  let content = '';
  
  for (const block of blocks.results) {
    if ('type' in block) {
      switch (block.type) {
        case 'paragraph':
          if ('paragraph' in block && block.paragraph.rich_text.length > 0) {
            content += block.paragraph.rich_text.map(text => text.plain_text).join('') + '\n\n';
          }
          break;
        case 'heading_1':
          if ('heading_1' in block && block.heading_1.rich_text.length > 0) {
            content += '# ' + block.heading_1.rich_text.map(text => text.plain_text).join('') + '\n\n';
          }
          break;
        case 'heading_2':
          if ('heading_2' in block && block.heading_2.rich_text.length > 0) {
            content += '## ' + block.heading_2.rich_text.map(text => text.plain_text).join('') + '\n\n';
          }
          break;
        case 'heading_3':
          if ('heading_3' in block && block.heading_3.rich_text.length > 0) {
            content += '### ' + block.heading_3.rich_text.map(text => text.plain_text).join('') + '\n\n';
          }
          break;
        case 'bulleted_list_item':
          if ('bulleted_list_item' in block && block.bulleted_list_item.rich_text.length > 0) {
            content += '- ' + block.bulleted_list_item.rich_text.map(text => text.plain_text).join('') + '\n';
          }
          break;
        case 'numbered_list_item':
          if ('numbered_list_item' in block && block.numbered_list_item.rich_text.length > 0) {
            content += '1. ' + block.numbered_list_item.rich_text.map(text => text.plain_text).join('') + '\n';
          }
          break;
        case 'code':
          if ('code' in block && block.code.rich_text.length > 0) {
            const language = block.code.language || '';
            content += '```' + language + '\n' + 
                      block.code.rich_text.map(text => text.plain_text).join('') + 
                      '\n```\n\n';
          }
          break;
        case 'quote':
          if ('quote' in block && block.quote.rich_text.length > 0) {
            content += '> ' + block.quote.rich_text.map(text => text.plain_text).join('') + '\n\n';
          }
          break;
      }
    }
  }

  return content;
}

// convertNotionToUnifiedPost 함수 수정
export async function convertNotionToUnifiedPost(notionPost: NotionPost): Promise<UnifiedPost> {
  const title = notionPost.properties.Title.title[0]?.plain_text || 'Untitled';
  const date = notionPost.properties.Date?.date?.start || notionPost.last_edited_time.split('T')[0];
  const category = notionPost.properties.Category?.select?.name || '📚 기술 정리 & 튜토리얼';
  const tags = notionPost.properties.Tags?.multi_select.map(tag => tag.name) || [];
  const status = notionPost.properties.Status?.select?.name || '🚧 작성중';
  const isPublished = notionPost.properties.Published?.checkbox || false;
  const description = notionPost.properties.Description?.rich_text[0]?.plain_text || '';
  
  // 페이지 콘텐츠 가져오기
  const content = await getPageContent(notionPost.id);
  
  return {
    id: notionPost.id,
    title,
    content,
    date,
    source: 'notion',
    slug: generateSlug(title),
    category,
    tags,
    status,
    isPublished,
    lastModified: notionPost.last_edited_time,
    description
  };
}

// 공개된 포스트만 가져오기
export async function getPublishedPosts(): Promise<UnifiedPost[]> {
  try {
    console.log('NOTION_DATABASE_ID:', process.env.NOTION_DATABASE_ID);
    if (!process.env.NOTION_DATABASE_ID) {
      throw new Error('NOTION_DATABASE_ID is not defined');
    }
    
    const posts = await getDatabaseItems(process.env.NOTION_DATABASE_ID);
    console.log('Fetched posts:', posts);
    return Promise.all(posts.map(async (post) => convertNotionToUnifiedPost(post)));
  } catch (error) {
    console.error('Error in getPublishedPosts:', error);
    return [];
  }
}

// 모든 포스트 가져오기 (관리용)
export async function getAllPosts(): Promise<UnifiedPost[]> {
  try {
    const posts = await getAllDatabaseItems(process.env.NOTION_DATABASE_ID!);
    return Promise.all(posts.map(async (post) => convertNotionToUnifiedPost(post)));
  } catch (error) {
    console.error('Error in getAllPosts:', error);
    return [];
  }
}
