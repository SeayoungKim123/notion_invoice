"use client";

import { useState, useMemo } from "react";
import type { Book } from "@/lib/notion";
import BookCard from "@/components/BookCard";
import SearchBar from "@/components/SearchBar";

const ALL_CATEGORY = "전체";

type SortKey = "latest" | "rating" | "title";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "rating", label: "별점순" },
  { value: "title", label: "제목순" },
];

function ratingToNumber(rating: string): number {
  const match = rating.match(/★(\d)/);
  return match ? parseInt(match[1], 10) : 0;
}

export default function BookList({ books }: { books: Book[] }) {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("latest");

  const categories = useMemo(() => {
    const set = new Set<string>();
    books.forEach((book) => {
      book.categories.forEach((cat) => set.add(cat));
    });
    return [ALL_CATEGORY, ...Array.from(set).sort()];
  }, [books]);

  const filteredBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = books
      .filter(
        (book) =>
          activeCategory === ALL_CATEGORY ||
          book.categories.includes(activeCategory),
      )
      .filter((book) => {
        if (!q) return true;
        return (
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          book.shortReview.toLowerCase().includes(q)
        );
      });

    return [...filtered].sort((a, b) => {
      if (sortKey === "latest") {
        return (b.readDate ?? "").localeCompare(a.readDate ?? "");
      }
      if (sortKey === "rating") {
        return ratingToNumber(b.rating) - ratingToNumber(a.rating);
      }
      if (sortKey === "title") {
        return a.title.localeCompare(b.title, "ko");
      }
      return 0;
    });
  }, [books, activeCategory, searchQuery, sortKey]);

  if (books.length === 0) {
    return (
      <p className="text-muted-foreground text-center text-sm">
        아직 등록된 책이 없습니다.
      </p>
    );
  }

  return (
    <div>
      {/* 검색창 + 정렬 */}
      <div className="mb-4 flex items-center gap-3 sm:mb-6">
        <div className="flex-1">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className="bg-muted text-foreground focus:ring-foreground/20 shrink-0 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2"
          aria-label="정렬 기준"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 카테고리 필터 탭 */}
      <div className="mb-6 flex flex-wrap gap-2 sm:mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            aria-pressed={activeCategory === cat}
            className={[
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeCategory === cat
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/70",
            ].join(" ")}
          >
            {cat}
            {cat !== ALL_CATEGORY && (
              <span className="ml-1.5 text-xs opacity-70">
                {books.filter((b) => b.categories.includes(cat)).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Book Grid */}
      {filteredBooks.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground text-sm">
            {searchQuery
              ? `"${searchQuery}"에 해당하는 책이 없습니다.`
              : "해당 카테고리의 책이 없습니다."}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-foreground mt-2 text-sm underline underline-offset-4"
            >
              검색어 초기화
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
