"use client";

import { useParams } from "next/navigation";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { getSection } from "@/lib/source/navigation";

export function Body({ children }: { children: ReactNode }): React.ReactElement {
  const mode = useMode();
  return (
    <body
      className={cn(
        mode,
        "flex flex-col min-h-screen"
      )}
    >
      {children}
    </body>
  );
}

/**
 * Returns the current section name from the URL (e.g. docs/[[...slug]] -> slug[0]).
 * Used as a class on body to switch --color-fd-primary via CSS.
 * Returns undefined when not in docs so no section class is applied.
 */
export function useMode(): string | undefined {
  const params = useParams();
  const slug = params.slug;
  if (!Array.isArray(slug)) return undefined;
  return getSection(slug[0]);
}
