import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/lib/notion";

function StarRating({ rating }: { rating: string }) {
  // rating 형식: "★1" ~ "★5" 또는 빈 문자열
  const match = rating.match(/(\d)/);
  const score = match ? parseInt(match[1], 10) : 0;

  if (score === 0) return null;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={
            i < score ? "text-sm text-yellow-400" : "text-sm text-gray-300"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/books/${book.id}`} className="group block">
      <div className="bg-card border-border overflow-hidden rounded-lg border transition-shadow hover:shadow-md">
        {/* 표지 이미지 */}
        <div className="bg-muted relative aspect-[2/3] w-full">
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt={`${book.title} 표지`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-muted-foreground text-4xl select-none">
                📚
              </span>
            </div>
          )}
        </div>

        {/* 책 정보 */}
        <div className="space-y-1 p-3">
          <h3 className="text-foreground line-clamp-2 text-sm leading-tight font-semibold sm:text-base">
            {book.title || "제목 없음"}
          </h3>
          <p className="text-muted-foreground truncate text-xs sm:text-sm">
            {book.author || "저자 미상"}
          </p>
          <StarRating rating={book.rating} />
        </div>
      </div>
    </Link>
  );
}
