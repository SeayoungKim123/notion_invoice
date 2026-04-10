const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const NOTION_API_KEY = process.env.NOTION_API_KEY;

async function updateDatabase() {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${DATABASE_ID}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          저자: { rich_text: {} },
          표지이미지: { files: {} },
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
          한줄평: { rich_text: {} },
          카테고리: { multi_select: { options: [] } },
          읽은날짜: { date: {} },
          상태: {
            select: {
              options: [
                { name: "완독", color: "green" },
                { name: "읽는 중", color: "yellow" },
                { name: "읽을 예정", color: "gray" },
              ],
            },
          },
          구매링크: { url: {} },
        },
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ 오류:", data);
    return;
  }

  console.log("✅ 필드 추가 완료!");
  console.log("추가된 필드:", Object.keys(data.properties).join(", "));
}

updateDatabase().catch(console.error);
