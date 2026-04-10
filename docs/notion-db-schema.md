# Notion DB 스키마: 독서 소개 페이지

> 작성일: 2026-04-10
> 기반 문서: [PRD - 독서 소개 페이지](../prd/book-shelf.md)

---

## 필드 정의

| 필드명      | 타입                  | 필수 | 비고                                                            |
| ----------- | --------------------- | ---- | --------------------------------------------------------------- |
| 제목        | Title                 | O    |                                                                 |
| 저자        | Text                  | O    |                                                                 |
| 표지 이미지 | Files & Media         | O    | 외부 URL만 허용 (Open Library Covers API 등 ISBN 기반 공개 API) |
| 별점        | Select                | O    | ★1 / ★2 / ★3 / ★4 / ★5                                          |
| 한 줄 평    | Text                  | O    |                                                                 |
| 카테고리    | Multi-select          | O    |                                                                 |
| 읽은 날짜   | Date                  | O    | 완독일 기준                                                     |
| 상태        | Select                | O    | 완독 / 읽는 중 / 읽을 예정                                      |
| 상세 리뷰   | Page Content (Blocks) | 선택 | Notion 페이지 본문에 작성                                       |
| 구매 링크   | URL                   | 선택 |                                                                 |

---

## 운영 정책

- **노출 조건:** `상태 = 완독`인 항목만 웹에 표시
- **정렬 기준:** 읽은 날짜 내림차순
- **표지 이미지:** Notion 내부 업로드 금지 — Notion 첨부 이미지는 1시간 후 URL 만료됨
- **상세 리뷰:** 중첩 블록(`has_children: true`) 사용 금지

---

## 지원 블록 타입 (상세 리뷰 작성 시)

| 블록 타입             | 지원 여부       |
| --------------------- | --------------- |
| paragraph             | O               |
| heading_1 ~ heading_3 | O               |
| bulleted_list_item    | O               |
| image                 | O               |
| quote                 | O               |
| callout               | O               |
| 그 외                 | X (렌더링 스킵) |

---

## 코드 연동 참고

- 필드명은 코드에서 상수화하여 관리 (스키마 변경 시 한 곳만 수정)
- `NOTION_API_KEY`, `NOTION_DATABASE_ID` 환경변수로 관리 (`.env.local`)
- API Key는 서버 사이드 전용 (클라이언트 노출 금지)
