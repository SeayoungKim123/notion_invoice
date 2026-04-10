export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="bg-background min-h-screen px-4 py-16">
      <div className="mx-auto max-w-2xl">
        {/* TODO: 책 상세 정보 표시 */}
        <p className="text-muted-foreground">Book ID: {id}</p>
      </div>
    </main>
  );
}
