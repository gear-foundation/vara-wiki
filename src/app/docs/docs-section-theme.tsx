"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function getDocsSection(pathname: string): string | null {
  const match = pathname?.match(/^\/docs\/([^/]+)/);
  const section = match ? match[1] : null;
  if (section === "vara-network" || section === "vara-eth" || section === "developing") {
    return section;
  }
  return null;
}

/**
 * Sets data-docs-section on <html> so CSS can override --primary (and related)
 * by current docs section. Renders nothing to avoid hydration mismatch (Radix IDs
 * stay consistent when this is a sibling of DocsLayout, not wrapping its children).
 */
export function DocsSectionTheme() {
  const pathname = usePathname();
  const section = pathname ? getDocsSection(pathname) : null;

  useEffect(() => {
    const el = document.documentElement;
    if (section) {
      el.setAttribute("data-docs-section", section);
    } else {
      el.removeAttribute("data-docs-section");
    }
    return () => el.removeAttribute("data-docs-section");
  }, [section]);

  return null;
}
