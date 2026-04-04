# 로드맵: 독서 소개 페이지 (Book Shelf)

> 작성일: 2026-04-04
> 기반 문서: [PRD - 독서 소개 페이지](../prd/book-shelf.md)
> 상태: 진행 전

---

## 태스크 목록

| #   | 태스크                                 | 마일스톤 | 의존           | 우선순위 |
| --- | -------------------------------------- | -------- | -------------- | -------- |
| 1   | Notion DB 스키마 확정                  | M1       | -              | Must     |
| 2   | Notion DB 초기 데이터 입력 (20권 이상) | M1       | #1             | Must     |
| 3   | @notionhq/client 설치 및 환경변수 설정 | M2       | -              | Must     |
| 4   | 책 목록 fetch 함수 구현                | M2       | #1, #3         | Must     |
| 5   | 메인 페이지 SSG/ISR 설정               | M2       | #4             | Must     |
| 6   | 책 목록 카드 컴포넌트 구현             | M3       | #4             | Must     |
| 7   | 카테고리 필터 구현                     | M3       | #6             | Should   |
| 8   | 책 상세 페이지 구현                    | M4       | #4             | Must     |
| 9   | Notion Blocks API 파싱 구현            | M4       | #8             | Must     |
| 10  | 반응형 스타일링 적용                   | M5       | #6, #7, #8, #9 | Must     |
| 11  | QA 및 엣지케이스 검증                  | M5       | #10            | Must     |
| 12  | Vercel 배포 및 서브도메인 설정         | M6       | #11            | Must     |

---

## 마일스톤 상세

### M1 — Notion DB 준비

- **#1** Notion DB 스키마 확정: 제목, 저자, 표지 이미지(외부 URL), 별점, 한 줄 평, 읽은 날짜, 상태, 카테고리(Multi-select). 필드명 상수화 기준으로 확정.
- **#2** 초기 데이터 입력: 완독 상태 책 20권 이상. 표지 이미지는 Open Library Covers API 기반 외부 URL 사용.

### M2 — Notion API 연동

- **#3** @notionhq/client 설치. `.env.local`에 `NOTION_API_KEY`, `NOTION_DATABASE_ID` 설정. API Key 서버 사이드 전용.
- **#4** 상태=완독 필터, 읽은 날짜 내림차순 정렬 fetch 함수 구현. Rate Limit(초당 3회) 대응.
- **#5** ISR revalidate 3600초 설정. `next.config.ts`에 `images.remotePatterns` 및 CSP `img-src` 추가.

### M3 — 메인 페이지 구현

- **#6** 책 목록 카드 컴포넌트: 표지 이미지(Next.js Image), 제목, 저자, 별점. Placeholder 및 빈 목록 안내 처리.
- **#7** 카테고리 필터 탭: 전체 보기 포함, 선택 탭 시각적 강조, 클라이언트 사이드 필터링.

### M4 — 상세 페이지 구현

- **#8** 책 상세 페이지: 동적 라우팅 `[id]`. 표시 항목: 제목, 저자, 표지 이미지, 별점, 한 줄 평, 읽은 날짜. 리뷰 없을 시 해당 섹션 미노출.
- **#9** Notion Blocks API 파싱: 지원 블록 — paragraph, heading_1~3, bulleted_list_item, image, quote, callout. 미지원 블록 스킵 처리.

### M5 — 스타일링 및 QA

- **#10** 반응형 스타일링: 모바일(375px~), 태블릿(768px~), 데스크탑(1280px~). 이미지 alt 텍스트, 키보드 네비게이션 접근성 체크.
- **#11** QA: Notion API 실패 처리, 표지 이미지 없음 처리, LCP 2.5초 이내 확인, 크로스 브라우저(Chrome/Safari/Firefox) 테스트.

### M6 — 배포

- **#12** Vercel 배포. 서브도메인 연결(books.기존도메인.com). 환경변수 Vercel 대시보드 설정. Vercel Analytics 연동.

---

## 병렬 착수 가능 태스크

- **#1** Notion DB 스키마 확정
- **#3** @notionhq/client 설치 및 환경변수 설정
