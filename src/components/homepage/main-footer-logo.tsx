"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sprite } from "@/components/ui/sprite";
import { cn } from "@/lib/utils";

export type MainLogoProps = {
  className?: string;
  url?: string;
};

export function MainFooterLogo({ className, url = "/" }: MainLogoProps) {
  const pathname = usePathname();
  const isHomepage = url === pathname;

  return (
    <Link
      href={url}
      className={cn(
        "aspect-[90/58] w-22.5",
        !isHomepage && "transition-opacity hover:opacity-70",
        className,
      )}
      onClick={(e) => {
        e.preventDefault();
        if (!isHomepage) return;

        const header = document.getElementById("page-header");
        if (!header) return;

        window?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }}
    >
      <span className="sr-only">Main page</span>
      <Sprite name="logo" className="size-full" aria-hidden />
    </Link>
  );
}
