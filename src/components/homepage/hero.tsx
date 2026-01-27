import Link from "next/link";

// bg-[radial-gradient(42%_52%_at_50%_70%,_color-mix(in_srgb,_oklch(0.85_0.15_165)_20%,_transparent)_0%,_transparent_100%)]
export function HomepageHero() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden dark:bg-card min-h-[min(calc(50svh),800px)]">
      <div className="absolute inset-0 z-0 dark:bg-[radial-gradient(42%_52%_at_50%_70%,_color-mix(in_srgb,_var(--primary)_20%,_transparent)_0%,_transparent_100%)] pointer-events-none" />
      <div className="container relative z-1 flex flex-col justify-center items-center py-15 text-foreground">
        <h1 className="mb-0 text-center font-semibold text-[42px]/[50px] md:text-[46px]/[55px] lg:text-[56px]/[1.2]">
          <span className="block mx-auto gradient-text-white">
            Vara Network
          </span>{" "}
          documentation portal
        </h1>
        <div className="mt-4 text-base text-muted-foreground md:text-[18px]/[24px] font-medium space-y-4 *:mb-0">
          <p>All documentation related to Vara Network</p>
        </div>
        <div className="mt-12 mb-0">
          <Link className="btn btn--primary" href="/docs/welcome">
            Discover Vara
          </Link>
        </div>
      </div>
    </section>
  );
}
