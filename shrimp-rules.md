# Development Guidelines — Book Shelf (Notion CMS)

## 1. Project Overview

- **목적**: Notion DB를 CMS로 사용하는 개인 독서 소개 웹페이지
- **스택**: Next.js 16.2.1 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · @notionhq/client
- **배포**: Vercel (서브도메인: books.기존도메인.com)
- **PRD 참조**: `prd/book-shelf.md`
- **로드맵 참조**: `docs/roadmap-book-shelf.md`

---

## 2. Directory Structure

```
app/
  layout.tsx           — 루트 레이아웃 (ThemeProvider 포함, metadata 수정 필요)
  page.tsx             — 책 목록 메인 페이지 (SSG/ISR)
  [id]/
    page.tsx           — 책 상세 페이지 (동적 라우팅, [id] = Notion page ID)
components/
  ui/                  — shadcn/ui 컴포넌트 (직접 수정 금지)
  BookCard.tsx         — 책 목록 카드 컴포넌트
  CategoryFilter.tsx   — 카테고리 필터 탭 (클라이언트 컴포넌트)
  BookDetail.tsx       — 상세 페이지 본문 컴포넌트
  NotionBlock.tsx      — Notion 블록 렌더러
lib/
  notion.ts            — Notion API fetch 함수 + NOTION_FIELDS 상수
  utils.ts             — cn() 유틸 (수정 금지)
next.config.ts         — CSP + images.remotePatterns 관리
.env.local             — NOTION_API_KEY, NOTION_DATABASE_ID (Git 제외)
prd/                   — PRD 문서 저장소
docs/                  — 로드맵 문서 저장소
```

> `lib/tech-data.tsx`는 스타터킷 잔재 — Book Shelf 기능 구현 시 삭제하고 참조 제거

---

## 3. Notion API Rules

### 환경변수

- `NOTION_API_KEY`, `NOTION_DATABASE_ID`는 `.env.local`에만 저장
- **클라이언트 컴포넌트(`'use client'`)에서 `process.env.NOTION_*` 접근 금지**
- Vercel 배포 시 대시보드에 동일 환경변수 설정

### Fetch 함수 위치

- 모든 Notion API 호출은 `lib/notion.ts`에만 작성
- 페이지 컴포넌트에서 직접 `@notionhq/client` import 금지

### 필드명 상수

- Notion DB 필드명은 `lib/notion.ts` 상단 `NOTION_FIELDS` 객체로 상수화
- 예시:
  ```ts
  export const NOTION_FIELDS = {
    STATUS: "상태",
    TITLE: "제목",
    AUTHOR: "저자",
    COVER_URL: "표지이미지",
    RATING: "별점",
    SHORT_REVIEW: "한줄평",
    READ_DATE: "읽은날짜",
    CATEGORY: "카테고리",
  } as const;
  ```
- 필드명 변경 시 이 상수만 수정

### 데이터 필터 및 정렬

- 목록 fetch 시 반드시 `상태 = 완독` 필터 적용
- 기본 정렬: 읽은 날짜 내림차순
- Rate Limit 대응: 빌드 타임 요청이 100건 초과 시 요청 간 딜레이 추가

### ISR 설정

- `app/page.tsx`와 `app/[id]/page.tsx`에 `export const revalidate = 3600` 설정
- SSG(`generateStaticParams`) 적용 시 Notion page ID 기준으로 params 생성

### Notion Blocks API

- **지원 블록 타입만 렌더링**: `paragraph`, `heading_1`, `heading_2`, `heading_3`, `bulleted_list_item`, `image`, `quote`, `callout`
- 미지원 블록 타입은 렌더링 스킵 (null 반환)
- 중첩 블록(`has_children: true`) 직접 사용 금지 — 재귀 호출 로직 또는 운영 정책으로 처리
- Notion 내부 첨부 이미지 URL 사용 금지 (1시간 만료) — 외부 URL만 허용

---

## 4. Component Rules

### 서버/클라이언트 컴포넌트 구분

- 데이터 fetch가 필요한 컴포넌트: 서버 컴포넌트 (기본)
- 인터랙션(카테고리 필터, 검색)이 필요한 컴포넌트: `'use client'` 명시

### BookCard 컴포넌트

- 표지 이미지: `next/image` Image 컴포넌트 사용 (img 태그 직접 사용 금지)
- 표지 이미지 없을 경우: placeholder 이미지 표시
- 필수 표시 항목: 표지 이미지, 제목, 저자, 별점

### CategoryFilter 컴포넌트

- `'use client'` 컴포넌트
- 전체 보기 탭 항상 포함
- 선택된 탭 시각적 강조 (shadcn/ui 스타일 기준)
- 필터링은 클라이언트 사이드에서 처리

### NotionBlock 컴포넌트

- 블록 타입별 switch/case 구조
- 미지원 타입은 `return null`

### 에러/빈 상태 처리

- Notion API 실패 시: 에러 throw 금지, 빈 배열 반환 + UI에 안내 문구 표시
- 책 0권: "아직 등록된 책이 없습니다" 문구 표시
- 상세 리뷰 없을 경우: 리뷰 섹션 미노출 (조건부 렌더링)

---

## 5. Styling Rules

- **Tailwind CSS v4 사용** — `@apply` 사용 금지, utility class 직접 적용
- 반응형 브레이크포인트: 모바일 375px, 태블릿 768px(`md:`), 데스크탑 1280px(`xl:`)
- shadcn/ui 컴포넌트(`components/ui/`) 직접 수정 금지 — 필요 시 래퍼 컴포넌트 작성
- 이미지 `alt` 텍스트 필수 제공 (접근성)
- 키보드 네비게이션 지원 확인 (포커스 스타일 제거 금지)

---

## 6. Key File Interaction Rules

| 변경 대상               | 함께 확인/수정할 파일                                                |
| ----------------------- | -------------------------------------------------------------------- |
| Notion DB 필드명 변경   | `lib/notion.ts` NOTION_FIELDS 상수만 수정                            |
| 외부 이미지 도메인 추가 | `next.config.ts` — `images.remotePatterns` + CSP `img-src` 동시 수정 |
| 새 페이지 라우트 추가   | `app/` 하위 디렉터리 생성 + `generateStaticParams` 구현 여부 확인    |
| 환경변수 추가           | `.env.local` + Vercel 대시보드 + README 환경변수 항목 동시 업데이트  |
| shadcn 컴포넌트 추가    | `components.json` 자동 갱신 확인 (`npx shadcn add`)                  |

### next.config.ts 수정 시 체크리스트

1. `images.remotePatterns`에 신규 이미지 호스트 추가
2. CSP `img-src`에 동일 도메인 추가
3. 현재 CSP `img-src`: `'self' data: blob:` — 외부 이미지 도메인 추가 필요

---

## 7. Prohibited Actions

- **클라이언트 컴포넌트에서 `NOTION_API_KEY` 직접 참조** — 서버 사이드 전용
- **Notion 첨부 이미지 URL 사용** — 1시간 만료로 ISR과 충돌
- **`img` 태그 직접 사용** — Next.js `Image` 컴포넌트 사용
- **`@apply` 사용** — Tailwind v4에서 권장하지 않음
- **`components/ui/` 직접 수정** — shadcn 재설치 시 덮어씌워짐
- **`lib/tech-data.tsx` 참조 유지** — Book Shelf 구현 시 제거 대상
- **지원 목록 외 Notion 블록 렌더링** — 명시된 8개 타입만 허용
- **중첩 블록(`has_children: true`) 사용** — 별도 설계 없이 구현 금지
- **Notion API 호출을 페이지 컴포넌트에 직접 작성** — 반드시 `lib/notion.ts`로 분리
- **`next.config.ts` CSP 수정 없이 외부 이미지 도메인 추가** — 이미지 미표시 버그 발생
