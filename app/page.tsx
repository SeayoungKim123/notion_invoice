export default function Home() {
  return (
    <main className="bg-background min-h-screen px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="text-foreground mb-3 text-4xl font-bold tracking-tight">
            Book Shelf
          </h1>
          <p className="text-muted-foreground text-lg">읽은 책을 소개합니다.</p>
        </div>
        {/* TODO: 책 목록 카드 그리드 */}
      </div>
    </main>
  );
}
