import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/lib/notion";
import StarRating from "@/components/StarRating";

export default function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/books/${book.id}`} className="group block cursor-pointer">
      <div className="bg-card border-border overflow-hidden rounded-lg border transition-shadow hover:shadow-lg">
        {/* 표지 이미지 */}
        <div className="bg-muted relative aspect-[2/3] w-full">
          <Image
            src={book.coverUrl || "/book-placeholder.svg"}
            alt={`${book.title} 표지`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
          {/* hover 오버레이 */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="text-sm font-medium text-white">자세히 보기</span>
          </div>
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
