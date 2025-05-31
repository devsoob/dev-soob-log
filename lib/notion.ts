import { Client } from "@notionhq/client";

// Notion API 클라이언트를 생성, 인증키는 환경변수로 관리해
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// 데이터베이스 ID를 받아서 Notion 데이터베이스에서 데이터 조회
export async function getDatabaseItems(databaseId: string) {
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  return response.results; // 조회된 결과만 반환
}
