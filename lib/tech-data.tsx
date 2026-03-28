import React from "react";
import {
  Palette,
  Component,
  Wrench,
  Type,
  Shield,
  Zap,
  Code2,
  Layers,
  Box,
  Sparkles,
  Moon,
  Wand2,
} from "lucide-react";

export type Category = "Framework" | "Styling" | "UI" | "Tooling";

export interface SubItem {
  slug: string;
  name: string;
  version: string;
  description: string;
}

export interface TechItem {
  slug: string;
  name: string;
  version: string;
  description: string;
  category: Category;
  icon: React.ReactNode;
  includes?: SubItem[];
}

export interface CategorySection {
  category: Category;
  items: TechItem[];
}

export const sections: CategorySection[] = [
  {
    category: "Framework",
    items: [
      {
        slug: "nextjs",
        name: "Next.js",
        version: "15",
        description:
          "App Router 기반 풀스택 React 프레임워크. 서버 컴포넌트, 스트리밍, 파일 기반 라우팅 등 현대적 웹 개발에 필요한 모든 기능을 제공합니다.",
        category: "Framework",
        icon: <Zap className="size-6" />,
        includes: [
          {
            slug: "react",
            name: "React",
            version: "19",
            description:
              "최신 React 컴파일러와 Server Components 지원. use() 훅, Actions 등 새로운 패러다임을 도입합니다.",
          },
        ],
      },
    ],
  },
  {
    category: "UI",
    items: [
      {
        slug: "shadcn-ui",
        name: "shadcn/ui",
        version: "4",
        description:
          "Radix UI 기반 재사용 가능한 컴포넌트 라이브러리. 복사-붙여넣기 방식으로 프로젝트에 직접 통합하며 완전한 커스터마이징이 가능합니다.",
        category: "UI",
        icon: <Component className="size-6" />,
        includes: [
          {
            slug: "radix-ui",
            name: "Radix UI",
            version: "1",
            description:
              "접근성을 갖춘 헤드리스 UI 프리미티브. WAI-ARIA 표준을 준수하며 스타일 없이 동작만 제공합니다.",
          },
          {
            slug: "lucide-react",
            name: "Lucide React",
            version: "0.5",
            description:
              "일관된 디자인의 오픈소스 아이콘 라이브러리. 5,000개 이상의 SVG 아이콘을 React 컴포넌트로 제공합니다.",
          },
          {
            slug: "next-themes",
            name: "next-themes",
            version: "0.4",
            description:
              "다크 모드 및 테마 전환 지원. SSR 환경에서 깜빡임 없는 테마 전환을 제공합니다.",
          },
        ],
      },
    ],
  },
  {
    category: "Styling",
    items: [
      {
        slug: "tailwind-css",
        name: "Tailwind CSS",
        version: "4",
        description:
          "유틸리티 퍼스트 CSS 프레임워크. v4에서 CSS-native 설정과 빌드 성능이 대폭 개선되었습니다.",
        category: "Styling",
        icon: <Palette className="size-6" />,
        includes: [
          {
            slug: "tw-animate-css",
            name: "tw-animate-css",
            version: "1",
            description:
              "Tailwind v4 호환 CSS 애니메이션 유틸리티. animate-in, animate-out 등의 클래스로 간편하게 애니메이션을 적용합니다.",
          },
        ],
      },
      {
        slug: "geist",
        name: "Geist",
        version: "—",
        description:
          "Vercel이 만든 깔끔한 Sans/Mono 폰트. 코드와 UI 모두에 최적화된 가독성을 제공합니다.",
        category: "Styling",
        icon: <Type className="size-6" />,
      },
    ],
  },
  {
    category: "Tooling",
    items: [
      {
        slug: "typescript",
        name: "TypeScript",
        version: "5",
        description:
          "정적 타입으로 안전한 코드 작성. 런타임 전 오류를 잡아내고 IDE 자동완성을 강화합니다.",
        category: "Tooling",
        icon: <Code2 className="size-6" />,
      },
      {
        slug: "eslint",
        name: "ESLint",
        version: "9",
        description:
          "Next.js 최적화 린트 규칙 적용. Flat config 방식으로 구성이 단순화되었습니다.",
        category: "Tooling",
        icon: <Shield className="size-6" />,
      },
      {
        slug: "prettier",
        name: "Prettier",
        version: "3",
        description:
          "Tailwind 클래스 정렬 플러그인 포함. 코드 스타일을 자동으로 통일합니다.",
        category: "Tooling",
        icon: <Wrench className="size-6" />,
      },
    ],
  },
];

// 하위 항목 아이콘 (상세 페이지용)
const subItemIcons: Record<string, React.ReactNode> = {
  react: <Layers className="size-6" />,
  "radix-ui": <Box className="size-6" />,
  "lucide-react": <Sparkles className="size-6" />,
  "next-themes": <Moon className="size-6" />,
  "tw-animate-css": <Wand2 className="size-6" />,
};

export interface FullTechItem extends TechItem {
  parentSlug?: string;
}

const fullItemsMap = new Map<string, FullTechItem>();

for (const section of sections) {
  for (const item of section.items) {
    fullItemsMap.set(item.slug, item);
    if (item.includes) {
      for (const sub of item.includes) {
        const subAsFull: FullTechItem = {
          slug: sub.slug,
          name: sub.name,
          version: sub.version,
          description: sub.description,
          category: item.category,
          icon: subItemIcons[sub.slug] ?? <Zap className="size-6" />,
          parentSlug: item.slug,
        };
        fullItemsMap.set(sub.slug, subAsFull);
      }
    }
  }
}

export function getTechBySlug(slug: string): FullTechItem | undefined {
  return fullItemsMap.get(slug);
}

export function getAllSlugs(): string[] {
  return Array.from(fullItemsMap.keys());
}

export const categoryColors: Record<Category, string> = {
  Framework:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Styling:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  UI: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Tooling:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
};

export const categoryHeadingColors: Record<Category, string> = {
  Framework: "text-blue-600 dark:text-blue-400",
  Styling: "text-purple-600 dark:text-purple-400",
  UI: "text-green-600 dark:text-green-400",
  Tooling: "text-orange-600 dark:text-orange-400",
};

export const categoryDividerColors: Record<Category, string> = {
  Framework: "bg-blue-200 dark:bg-blue-800",
  Styling: "bg-purple-200 dark:bg-purple-800",
  UI: "bg-green-200 dark:bg-green-800",
  Tooling: "bg-orange-200 dark:bg-orange-800",
};

export const subItemColors: Record<Category, string> = {
  Framework:
    "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  Styling:
    "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  UI: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
  Tooling:
    "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
};
