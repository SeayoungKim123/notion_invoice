import type { Book } from "@/lib/notion";

interface BookStatsProps {
  books: Book[];
}

export default function BookStats({ books }: BookStatsProps) {
  const total = books.length;

  // 카테고리별 분포
  const byCategory = books.reduce<Record<string, number>>((acc, book) => {
    book.categories.forEach((cat) => {
      acc[cat] = (acc[cat] ?? 0) + 1;
    });
    return acc;
  }, {});

  const sortedCategories = Object.entries(byCategory).sort(
    (a, b) => b[1] - a[1],
  );

  // 연도별 독서 권수
  const byYear = books.reduce<Record<number, number>>((acc, book) => {
    if (!book.readDate) return acc;
    const year = new Date(book.readDate).getFullYear();
    if (!isNaN(year)) {
      acc[year] = (acc[year] ?? 0) + 1;
    }
    return acc;
  }, {});

  const sortedYears = Object.entries(byYear)
    .map(([year, count]) => ({ year: Number(year), count }))
    .sort((a, b) => b.year - a.year);

  const maxYearCount = Math.max(...sortedYears.map((y) => y.count), 1);

  if (total === 0) return null;

  return (
    <div className="mb-10 sm:mb-12">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* 총 독서 권수 */}
        <div className="bg-muted rounded-xl p-5">
          <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
            총 독서
          </p>
          <p className="text-foreground text-3xl font-bold">{total}</p>
          <p className="text-muted-foreground text-sm">권</p>
        </div>

        {/* 카테고리별 분포 */}
        <div className="bg-muted rounded-xl p-5">
          <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
            카테고리별
          </p>
          {sortedCategories.length === 0 ? (
            <p className="text-muted-foreground text-sm">데이터 없음</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {sortedCategories.slice(0, 6).map(([cat, count]) => (
                <span
                  key={cat}
                  className="bg-background text-foreground rounded-full px-3 py-1 text-xs font-medium"
                >
                  {cat}
                  <span className="text-muted-foreground ml-1">{count}</span>
                </span>
              ))}
              {sortedCategories.length > 6 && (
                <span className="text-muted-foreground self-center text-xs">
                  +{sortedCategories.length - 6}개
                </span>
              )}
            </div>
          )}
        </div>

        {/* 연도별 독서 권수 */}
        <div className="bg-muted rounded-xl p-5">
          <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
            연도별
          </p>
          {sortedYears.length === 0 ? (
            <p className="text-muted-foreground text-sm">데이터 없음</p>
          ) : (
            <div className="flex flex-col gap-2">
              {sortedYears.slice(0, 4).map(({ year, count }) => (
                <div key={year} className="flex items-center gap-2">
                  <span className="text-muted-foreground w-10 shrink-0 text-xs">
                    {year}
                  </span>
                  <div className="bg-background h-2 flex-1 overflow-hidden rounded-full">
                    <div
                      className="bg-foreground h-full rounded-full transition-all"
                      style={{
                        width: `${Math.round((count / maxYearCount) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-foreground w-6 shrink-0 text-right text-xs font-medium">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
