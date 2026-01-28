"use client";

import Link from "next/link";
import type { MainFooterProps } from "@/components/homepage/main-footer";
import { FOOTER_NAVIGATION } from "@/components/homepage/main-footer.data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export function FooterNavigation({ className }: MainFooterProps) {
  return (
    <Accordion
      multiple
      className={cn("grid divide-y divide-border *:py-4", className)}
    >
      {FOOTER_NAVIGATION.map(({ id, title, list }) => (
        <AccordionItem
          key={id}
          value={id}
          className="rounded-none bg-transparent first:pt-0 last:pb-0"
        >
          <AccordionTrigger className="flex w-full justify-between gap-5 text-[17px]/[1.3] font-bold">
            {title}
            {/*<span className="size-5 transform-gpu transition-transform duration-300 group-aria-expanded:rotate-180">*/}
            {/*  <ArrowRightIcon className="size-5 rotate-90" />*/}
            {/*</span>*/}
          </AccordionTrigger>
          <AccordionContent>
            <ol className="space-y-3 pt-3 text-base/[1.4] font-medium text-muted-foreground">
              {list.map(({ link, title }, i) => {
                const isExternal = link.includes("http");
                return (
                  <li key={i}>
                    <Link
                      href={link}
                      className="transition-colors hover:text-foreground"
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noreferrer" : undefined}
                    >
                      {title}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
