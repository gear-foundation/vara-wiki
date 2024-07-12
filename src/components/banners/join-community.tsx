import Link from "@docusaurus/Link";
import { SOCIALS } from "@site/src/lib/data/socials.data";
import { Sprite } from "../ui/sprite";
import { cn } from "@site/src/lib/utils";

type Props = {
  className?: string;
};

export function JoinCommunityBanner({ className, ...rest }: Props) {
  return (
    <section
      className={cn("container flex flex-col items-center *:mb-0", className)}
      {...rest}
    >
      <h2 className="text-center max-md:text-[48px] max-md:leading-[58px] typo-title-1 font-medium 2xl:leading-[86px]">
        Join Vara{" "}
        <span className="gradient-text-black dark:gradient-text-white">
          Community
        </span>
      </h2>
      <p className="mt-6 max-w-[640px] mx-auto text-center text-lg/[1.4]">
        Follow the Vara social channels and join the{" "}
        <span className="block md:inline">
          conversation on the future of Web3
        </span>
      </p>
      <ul className="list-none flex items-center justify-between sm:justify-start space-x-5 md:space-x-8 mt-12 xl:mt-14.5">
        {Object.values(SOCIALS).map((item, i) => (
          <li key={i}>
            <Link
              href={item.url}
              className="text-black dark:text-white hover:!text-brand active:!text-brand-600 duration-200 transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              <span className="sr-only">{item.title}</span>
              <Sprite
                name={item.icon}
                className="inline-block size-8 md:size-12"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
