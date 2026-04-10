const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const NOTION_API_KEY = process.env.NOTION_API_KEY;

const BOOKS = [
  {
    제목: "린 스타트업",
    저자: "에릭 리스",
    표지이미지: "https://covers.openlibrary.org/b/isbn/9788966260690-L.jpg",
    별점: "★5",
    한줄평: "MVP와 빠른 실험이 곧 생존이다.",
    카테고리: ["경영", "스타트업"],
    읽은날짜: "2025-12-10",
    상태: "완독",
    구매링크: "https://www.yes24.com/product/goods/7413488",
  },
  {
    제목: "제로 투 원",
    저자: "피터 틸",
    표지이미지: "https://covers.openlibrary.org/b/isbn/9788994476971-L.jpg",
    별점: "★5",
    한줄평: "경쟁을 피하고 독점을 만들어라.",
    카테고리: ["경영", "스타트업"],
    읽은날짜: "2025-11-20",
    상태: "완독",
    구매링크: "https://www.yes24.com/product/goods/17030107",
  },
  {
    제목: "하드씽",
    저자: "벤 호로위츠",
    표지이미지: "https://covers.openlibrary.org/b/isbn/9788994774756-L.jpg",
    별점: "★4",
    한줄평: "CEO의 자리는 쉬운 답이 없는 싸움의 연속이다.",
    카테고리: ["경영", "리더십"],
    읽은날짜: "2025-10-15",
    상태: "완독",
  },
  {
    제목: "인스파이어드",
    저자: "마티 케이건",
    표지이미지: "https://covers.openlibrary.org/b/isbn/9791162241837-L.jpg",
    별점: "★5",
    한줄평: "PM이 진짜 해야 할 일이 무엇인지 알려준다.",
    카테고리: ["제품", "PM"],
    읽은날짜: "2025-09-30",
    상태: "완독",
    구매링크: "https://www.yes24.com/product/goods/72454840",
  },
  {
    제목: "사용자를 생각하게 하지 마",
    저자: "스티브 크룩",
    표지이미지: "https://covers.openlibrary.org/b/isbn/9788966261284-L.jpg",
    별점: "★4",
    한줄평: "UX의 핵심은 사용자가 생각하지 않아도 되게 만드는 것.",
    카테고리: ["UX", "디자인"],
    읽은날짜: "2025-09-01",
    상태: "완독",
  },
  {
    제목: "넛지",
    저자: "리처드 탈러, 캐스 선스타인",
    표지이미지: "https://covers.openlibrary.org/b/isbn/9788932920245-L.jpg",
    별점: "★4",
    한줄평: "선택 설계가 사람의 행동을 바꾼다.",
    카테고리: ["심리학", "경영"],
    읽은날짜: "2025-08-10",
    상태: "완독",
  },
  {
    제목: "생각에 관한 생각",
    저자: "대니얼 카너먼",
    표지이미지: "https://covers.openlibrary.org/b/isbn/9788934972464-L.jpg",
    별점: "★5",
    한줄평: "시스템1과 시스템2, 우리가 왜 틀리는지를 알게 된다.",
    카테고리: ["심리학", "행동경제학"],
    읽은날짜: "2025-07-20",
    상태: "완독",
    구매링크: "https://www.yes24.com/product/goods/12040012",
  },
  {
    제목: "프로덕트 매니지먼트",
    저자: "로리 서덜랜드",
    표지이미지: "https://covers.openlibrary.org/b/isbn/9791188850167-L.jpg",
    별점: "★3",
    한줄평: "실무 중심의 PM 가이드북.",
    카테고리: ["제품", "PM"],
    읽은날짜: "2025-06-15",
    상태: "완독",
  },
  {
    제목: "컬처 코드",
    저자: "대니얼 코일",
    표지이미지: "https://covers.openlibrary.org/b/isbn/9791162540459-L.jpg",
    별점: "★4",
    한줄평: "최고의 팀은 심리적 안전감 위에서 만들어진다.",
    카테고리: ["리더십", "조직문화"],
    읽은날짜: "2025-05-30",
    상태: "완독",
  },
  {
    제목: "원칙",
    저자: "레이 달리오",
    표지이미지: "https://covers.openlibrary.org/b/isbn/9788950975494-L.jpg",
    별점: "★5",
    한줄평: "삶과 일의 원칙을 명문화하면 의사결정이 쉬워진다.",
    카테고리: ["경영", "자기계발"],
    읽은날짜: "2025-05-01",
    상태: "완독",
    구매링크: "https://www.yes24.com/product/goods/56480788",
  },
];

async function addBook(book) {
  const properties = {
    Name: {
      title: [{ text: { content: book.제목 } }],
    },
    저자: {
      rich_text: [{ text: { content: book.저자 } }],
    },
    표지이미지: {
      files: [{ name: book.제목, external: { url: book.표지이미지 } }],
    },
    별점: {
      select: { name: book.별점 },
    },
    한줄평: {
      rich_text: [{ text: { content: book.한줄평 } }],
    },
    카테고리: {
      multi_select: book.카테고리.map((c) => ({ name: c })),
    },
    읽은날짜: {
      date: { start: book.읽은날짜 },
    },
    상태: {
      select: { name: book.상태 },
    },
  };

  if (book.구매링크) {
    properties.구매링크 = { url: book.구매링크 };
  }

  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: DATABASE_ID },
      properties,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`${book.제목} 추가 실패: ${JSON.stringify(data)}`);
  }
  return data;
}

async function seed() {
  console.log(`📚 총 ${BOOKS.length}권 추가 시작...\n`);

  for (const book of BOOKS) {
    await addBook(book);
    console.log(`✅ ${book.제목}`);
    // Rate limit 대응 (초당 3회 제한)
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log("\n🎉 전체 추가 완료!");
}

seed().catch(console.error);
