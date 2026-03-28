import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  getTechBySlug,
  getAllSlugs,
  categoryColors,
  subItemColors,
  categoryHeadingColors,
} from "@/lib/tech-data";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function TechDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tech = getTechBySlug(slug);

  if (!tech) notFound();

  const parent = tech.parentSlug ? getTechBySlug(tech.parentSlug) : undefined;

  return (
    <main className="min-h-screen bg-background px-4 py-16">
      <div className="mx-auto max-w-2xl">
        {/* Back */}
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-4">
            <div className="text-foreground">{tech.icon}</div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {tech.name}
              </h1>
              <span className="text-sm text-muted-foreground">
                v{tech.version}
              </span>
            </div>
            <span
              className={`ml-auto rounded-full px-3 py-1 text-sm font-medium ${categoryColors[tech.category]}`}
            >
              {tech.category}
            </span>
          </div>
          <p className="text-base text-muted-foreground">{tech.description}</p>
        </div>

        {/* Part of (하위 항목인 경우) */}
        {parent && (
          <div className="mb-8 rounded-xl border border-border bg-card p-4">
            <p className="mb-2 text-xs text-muted-foreground">Part of</p>
            <Link
              href={`/${parent.slug}`}
              className="flex items-center gap-2 font-semibold text-card-foreground hover:underline"
            >
              <span>{parent.icon}</span>
              {parent.name}
            </Link>
          </div>
        )}

        {/* Includes (상위 항목인 경우) */}
        {tech.includes && tech.includes.length > 0 && (
          <div>
            <div className="mb-4 flex items-center gap-3">
              <h2
                className={`text-sm font-semibold uppercase tracking-widest ${categoryHeadingColors[tech.category]}`}
              >
                Includes
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {tech.includes.map((sub) => {
                const subFull = getTechBySlug(sub.slug);
                return (
                  <Link
                    key={sub.slug}
                    href={`/${sub.slug}`}
                    className="rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      {subFull && (
                        <div className="text-foreground">{subFull.icon}</div>
                      )}
                      <div>
                        <p className="font-semibold text-card-foreground">
                          {sub.name}
                        </p>
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-xs font-medium ${subItemColors[tech.category]}`}
                        >
                          v{sub.version}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {sub.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
