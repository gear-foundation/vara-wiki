import Link from "next/link";
import { HeroBgVideo } from "@/components/sections/home/blocks/hero/video";
import { Sprite } from "@/components/ui/sprite";
import { cn } from "@/lib/cn";
import { SOCIALS } from "@/lib/data/socials.data";

type BaseComponentProps = {
  className?: string;
  children?: React.ReactNode;
};

type JoinCommunityBannerProps = BaseComponentProps & {};

export function JoinCommunityBanner({
  className,
  ...rest
}: JoinCommunityBannerProps) {
  return (
    <section className={cn("container", className)} {...rest}>
      <div className="relative rounded-xl border border-border py-17 md:py-20 dark:bg-card overflow-hidden">
        <div className="relative z-2 flex flex-col items-center">
          <h2 className="text-center text-[40px] font-bold leading-[1.4] lg:text-[48px]">
            Join Vara Community
          </h2>
          <p className="mx-auto mt-6 max-w-160 text-center text-base/[1.4] text-muted-foreground">
            Follow the Vara social channels and join the{" "}
            <span className="block md:inline">
              conversation on the future of Web3
            </span>
          </p>
          <ul className="mt-12 flex items-center justify-between space-x-4 sm:justify-start md:space-x-8 xl:mt-18">
            {Object.values(SOCIALS).map((item, i) => (
              <li key={i}>
                <Link
                  href={item.url}
                  className="transition-colors duration-200 hover:text-primary active:text-primary/70"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="sr-only">{item.title}</span>
                  <Sprite
                    name={item.icon}
                    className="inline-block size-8 xl:size-10"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <HeroBgVideo className="z-1" />
      </div>
    </section>
  );
}
