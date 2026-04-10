import { Client, isFullPage } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client";

export const NOTION_FIELDS = {
  TITLE: "Name",
  AUTHOR: "저자",
  COVER_URL: "표지이미지",
  RATING: "별점",
  SHORT_REVIEW: "한줄평",
  READ_DATE: "읽은날짜",
  CATEGORY: "카테고리",
  STATUS: "상태",
  PURCHASE_LINK: "구매링크",
} as const;

export const STATUS_VALUES = {
  COMPLETED: "완독",
  READING: "읽는 중",
  WANT: "읽을 예정",
} as const;

export type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  rating: string;
  shortReview: string;
  readDate: string;
  categories: string[];
  status: string;
  purchaseLink?: string;
};

const notion = new Client({ auth: process.env.NOTION_API_KEY });

function pageToBook(page: PageObjectResponse): Book {
  const props = page.properties;

  const titleProp = props[NOTION_FIELDS.TITLE];
  const title =
    titleProp?.type === "title"
      ? titleProp.title.map((t) => t.plain_text).join("")
      : "";

  const authorProp = props[NOTION_FIELDS.AUTHOR];
  const author =
    authorProp?.type === "rich_text"
      ? authorProp.rich_text.map((t) => t.plain_text).join("")
      : "";

  const coverProp = props[NOTION_FIELDS.COVER_URL];
  let coverUrl = "";
  if (coverProp?.type === "files" && coverProp.files.length > 0) {
    const realFile = coverProp.files.find((f) => {
      const url = f.type === "external" ? f.external.url : f.file.url;
      return !url.includes("covers.openlibrary.org");
    });
    if (realFile) {
      coverUrl =
        realFile.type === "external"
          ? realFile.external.url
          : realFile.file.url;
    }
  }

  const ratingProp = props[NOTION_FIELDS.RATING];
  const rating =
    ratingProp?.type === "select" ? (ratingProp.select?.name ?? "") : "";

  const reviewProp = props[NOTION_FIELDS.SHORT_REVIEW];
  const shortReview =
    reviewProp?.type === "rich_text"
      ? reviewProp.rich_text.map((t) => t.plain_text).join("")
      : "";

  const dateProp = props[NOTION_FIELDS.READ_DATE];
  const readDate =
    dateProp?.type === "date" ? (dateProp.date?.start ?? "") : "";

  const categoryProp = props[NOTION_FIELDS.CATEGORY];
  const categories =
    categoryProp?.type === "multi_select"
      ? categoryProp.multi_select.map((s) => s.name)
      : [];

  const statusProp = props[NOTION_FIELDS.STATUS];
  const status =
    statusProp?.type === "select" ? (statusProp.select?.name ?? "") : "";

  const linkProp = props[NOTION_FIELDS.PURCHASE_LINK];
  const purchaseLink =
    linkProp?.type === "url" ? (linkProp.url ?? undefined) : undefined;

  return {
    id: page.id,
    title,
    author,
    coverUrl,
    rating,
    shortReview,
    readDate,
    categories,
    status,
    purchaseLink,
  };
}

export async function getBookById(id: string): Promise<Book | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    if (!isFullPage(page)) return null;
    return pageToBook(page);
  } catch {
    return null;
  }
}

export async function getBooks(): Promise<Book[]> {
  const response = await notion.dataSources.query({
    data_source_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: NOTION_FIELDS.STATUS,
      select: { equals: STATUS_VALUES.COMPLETED },
    },
    sorts: [
      {
        property: NOTION_FIELDS.READ_DATE,
        direction: "descending",
      },
    ],
  });

  return response.results.filter(isFullPage).map(pageToBook);
}
