"use client";

import { useState, useMemo } from "react";
import type { Book } from "@/lib/notion";
import BookCard from "@/components/BookCard";

const ALL_CATEGORY = "전체";

export default function BookList({ books }: { books: Book[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    books.forEach((book) => {
      book.categories.forEach((cat) => set.add(cat));
    });
    return [ALL_CATEGORY, ...Array.from(set).sort()];
  }, [books]);

  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);

  const filteredBooks = useMemo(() => {
    if (activeCategory === ALL_CATEGORY) return books;
    return books.filter((book) => book.categories.includes(activeCategory));
  }, [books, activeCategory]);

  if (books.length === 0) {
    return (
      <p className="text-muted-foreground text-center text-sm">
        아직 등록된 책이 없습니다.
      </p>
    );
  }

  return (
    <div>
      {/* 카테고리 필터 탭 */}
      <div className="mb-6 flex flex-wrap gap-2 sm:mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
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
        <p className="text-muted-foreground text-center text-sm">
          해당 카테고리의 책이 없습니다.
        </p>
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
