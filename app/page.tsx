import { getBooks } from "@/lib/notion";
import type { Book } from "@/lib/notion";
import BookList from "@/components/BookList";
import BookStats from "@/components/BookStats";
import ThemeToggle from "@/components/ThemeToggle";

export const revalidate = 3600;

export default async function Home() {
  let books: Book[] = [];

  try {
    books = await getBooks();
  } catch (error) {
    console.error(
      "[Notion API Error]",
      error instanceof Error ? error.message : "Unknown error",
    );
  }

  const currentYear = new Date().getFullYear();
  const totalCount = books.length;
  const thisYearCount = books.filter((book) =>
    book.readDate?.startsWith(String(currentYear)),
  ).length;

  return (
    <main className="bg-background min-h-screen px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex justify-end">
            <ThemeToggle />
          </div>
          <div className="text-center">
            <h1 className="text-foreground mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Book Shelf
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              읽은 책을 소개합니다.
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mb-8 flex justify-center gap-6 sm:mb-10 sm:gap-8">
          <div className="text-center">
            <p className="text-foreground text-2xl font-bold sm:text-3xl">
              {totalCount}
            </p>
            <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
              총 읽은 책
            </p>
          </div>
          <div className="bg-border w-px" />
          <div className="text-center">
            <p className="text-foreground text-2xl font-bold sm:text-3xl">
              {thisYearCount}
            </p>
            <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
              올해 읽은 책
            </p>
          </div>
        </div>

        {/* 독서 통계 */}
        <BookStats books={books} />

        {/* Book List with Category Filter */}
        <BookList books={books} />
      </div>
    </main>
  );
}
