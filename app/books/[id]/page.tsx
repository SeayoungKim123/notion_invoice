import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBooks, getBookById } from "@/lib/notion";
import StarRating from "@/components/StarRating";

export const revalidate = 3600;

export async function generateStaticParams() {
  const books = await getBooks();
  return books.map((book) => ({ id: book.id }));
}

function isSafeUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-12">
      {/* 뒤로 가기 */}
      <Link
        href="/"
        className="bg-muted text-foreground hover:bg-muted/70 mb-8 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
      >
        ← 목록으로 돌아가기
      </Link>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:gap-8">
        {/* 표지 이미지 */}
        <div className="bg-muted relative mx-auto h-56 w-40 shrink-0 overflow-hidden rounded-lg shadow-md sm:mx-0 sm:h-64 sm:w-44">
          <Image
            src={book.coverUrl || "/book-placeholder.svg"}
            alt={`${book.title} 표지`}
            fill
            sizes="(max-width: 640px) 160px, 176px"
            className="object-cover"
            priority
          />
        </div>

        {/* 책 정보 */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* 카테고리 */}
          {book.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {book.categories.map((cat) => (
                <span
                  key={cat}
                  className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* 제목 */}
          <h1 className="text-foreground text-xl leading-snug font-bold sm:text-2xl">
            {book.title || "제목 없음"}
          </h1>

          {/* 저자 */}
          <p className="text-muted-foreground text-sm sm:text-base">
            {book.author || "저자 미상"}
          </p>

          {/* 별점 */}
          {book.rating && (
            <StarRating rating={book.rating} size="lg" showScore />
          )}

          {/* 읽은 날짜 */}
          {book.readDate && (
            <p className="text-muted-foreground text-sm">
              읽은 날짜:{" "}
              <span className="text-foreground font-medium">
                {book.readDate}
              </span>
            </p>
          )}

          {/* 구매 링크 */}
          {book.purchaseLink && isSafeUrl(book.purchaseLink) && (
            <a
              href={book.purchaseLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-foreground text-background mt-2 inline-flex w-fit items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
            >
              구매하기 →
            </a>
          )}
        </div>
      </div>

      {/* 한줄평 */}
      {book.shortReview && (
        <div className="border-border bg-muted/50 mt-10 rounded-lg border p-5">
          <h2 className="text-foreground mb-2 text-sm font-semibold">한줄평</h2>
          <p className="text-foreground/80 leading-relaxed">
            {book.shortReview}
          </p>
        </div>
      )}
    </main>
  );
}
