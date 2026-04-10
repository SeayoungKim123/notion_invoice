import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const PARENT_PAGE_ID = "33eb963675ae8057853ac00f1e54a814";

async function createDatabase() {
  const response = await notion.databases.create({
    parent: {
      type: "page_id",
      page_id: PARENT_PAGE_ID,
    },
    title: [{ type: "text", text: { content: "독서 목록" } }],
    properties: {
      제목: {
        title: {},
      },
      저자: {
        rich_text: {},
      },
      표지이미지: {
        files: {},
      },
      별점: {
        select: {
          options: [
            { name: "★1", color: "red" },
            { name: "★2", color: "orange" },
            { name: "★3", color: "yellow" },
            { name: "★4", color: "blue" },
            { name: "★5", color: "green" },
          ],
        },
      },
      한줄평: {
        rich_text: {},
      },
      카테고리: {
        multi_select: {
          options: [],
        },
      },
      읽은날짜: {
        date: {},
      },
      상태: {
        select: {
          options: [
            { name: "완독", color: "green" },
            { name: "읽는 중", color: "yellow" },
            { name: "읽을 예정", color: "gray" },
          ],
        },
      },
      구매링크: {
        url: {},
      },
    },
  });

  console.log("✅ DB 생성 완료!");
  console.log("NOTION_DATABASE_ID=" + response.id);
}

createDatabase().catch(console.error);
