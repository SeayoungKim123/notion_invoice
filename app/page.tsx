import Link from "next/link";

import {
  sections,
  categoryColors,
  categoryHeadingColors,
  categoryDividerColors,
  subItemColors,
} from "@/lib/tech-data";

export default function Home() {
  return (
    <main className="bg-background min-h-screen px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="text-foreground mb-3 text-4xl font-bold tracking-tight">
            Next.js Starter Kit
          </h1>
          <p className="text-muted-foreground text-lg">
            현대적인 웹 개발을 위한 기술 스택
          </p>
        </div>

        <div className="space-y-10">
          {sections.map(({ category, items }) => (
            <div key={category}>
              <div className="mb-4 flex items-center gap-3">
                <h2
                  className={`text-sm font-semibold tracking-widest uppercase ${categoryHeadingColors[category]}`}
                >
                  {category}
                </h2>
                <div
                  className={`h-px flex-1 ${categoryDividerColors[category]}`}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((tech) => (
                  <Link
                    key={tech.slug}
                    href={`/${tech.slug}`}
                    className="border-border bg-card rounded-xl border p-5 transition-shadow hover:shadow-md"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-foreground">{tech.icon}</div>
                        <div>
                          <h3 className="text-card-foreground font-semibold">
                            {tech.name}
                          </h3>
                          <span className="text-muted-foreground text-xs">
                            v{tech.version}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${categoryColors[tech.category]}`}
                      >
                        {tech.category}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {tech.description}
                    </p>
                    {tech.includes && tech.includes.length > 0 && (
                      <div className="border-border mt-3 border-t pt-3">
                        <p className="text-muted-foreground mb-2 text-xs">
                          includes
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {tech.includes.map((sub) => (
                            <span
                              key={sub.slug}
                              className={`rounded-md px-2 py-0.5 text-xs font-medium ${subItemColors[tech.category]}`}
                            >
                              {sub.name}{" "}
                              <span className="opacity-60">v{sub.version}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
