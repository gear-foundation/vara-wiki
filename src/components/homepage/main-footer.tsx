import Link from "next/link";
import { FOOTER_NAVIGATION } from "@/components/homepage/main-footer.data";
import { FooterNavigation } from "@/components/homepage/main-footer.navigation";
import { IconEmail } from "@/components/icons/icon-email";
import { Sprite } from "@/components/ui/sprite";
import { SOCIALS } from "@/lib/data/socials.data";
import { cn } from "@/lib/utils";

export type MainFooterProps = {
  className?: string;
  noFooterImage?: boolean;
};

export const MainFooter = ({ className }: MainFooterProps) => {
  return (
    <footer
      className={cn(
        "relative flex flex-col",
        "[--item-width:218px] lg:[--item-width:276px]",
        className,
      )}
    >
      <Socials className="order-last md:order-first" />
      <div className="pb-4 pt-6 md:py-12">
        <div className="container">
          <FooterNavigation className="md:hidden" />

          <ul className="hidden flex-wrap gap-x-8 gap-y-12 md:flex md:*:basis-(--item-width)">
            {FOOTER_NAVIGATION.map(({ id, title, list }) => (
              <li key={id} className="flex flex-col gap-3 bg-transparent">
                <h3 className="py-1 text-[17px]/[1.3] font-bold">{title}</h3>
                <ol className="space-y-3 text-sm text-muted-foreground">
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
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Copyright />
    </footer>
  );
};

function Socials({ className }: MainFooterProps) {
  return (
    <div
      className={cn(
        "relative pb-5 pt-14 before:absolute before:inset-x-0 before:bottom-0 before:hidden before:h-px before:bg-border/50 md:pb-4 md:pt-5 md:before:block",
        className,
      )}
    >
      <div className="container flex flex-col justify-between gap-5 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
        <ul className="flex items-center gap-4 lg:gap-3">
          {Object.values(SOCIALS).map((item, i) => (
            <li key={i}>
              <Link
                href={item.url}
                className="group flex items-center gap-2 lg:pr-8"
                target="_blank"
                rel="noreferrer"
              >
                <Sprite
                  name={item.icon}
                  className="size-5 transition-colors text-foreground group-hover:text-brand-600 group-active:text-brand"
                />
                <span className="sr-only lg:not-sr-only">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="https://47ae15d0.sibforms.com/serve/MUIFALAbZWXVVQ84ggnZlHwMlElm-3daARRbWwwMPuWZaTJa82jLSwrs5jarEAoHpN5CkuAt094_eh_9f9_KeNgOTUwzVv-jlLiyIuqAj0tymx1mt-qYI_jrrl1-BXJXBFR9qm5KlPWQTA6yR34njGpVoyzBzZgPUIPt2z-RGHlPR2e75SBYDL0t564sxFyrrJ35ttAS7m0PWOnE"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-2 md:basis-[--item-width]"
        >
          <IconEmail className="size-5 transition-colors text-foreground group-hover:text-brand-600 group-active:text-brand" />
          Subscribe to Vara updates
        </Link>
      </div>
    </div>
  );
}

function Copyright({ className }: MainFooterProps) {
  return (
    <div
      className={cn(
        "relative order-last pb-7.5 pt-4 before:absolute before:inset-x-0 before:-top-px before:h-px before:bg-border/50 md:pb-20",
        className,
      )}
    >
      <div className="container">
        <p className="text-xs/[1.6] text-muted-foreground">
          &copy; {new Date().getFullYear()} Gear Foundation, Inc. All Rights
          Reserved.
        </p>
      </div>
    </div>
  );
}
