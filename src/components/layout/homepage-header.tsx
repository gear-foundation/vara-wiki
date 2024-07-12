import Link from "@docusaurus/Link";

export function HomepageHeader() {
  return (
    <header className="relative overflow-hidden bg-[#242625]">
      <div className="absolute inset-0 bg-[radial-gradient(42%_52%_at_50%_70%,_var(--tw-gradient-stops))] from-0% from-[#00FFC4]/20 to-[#00FFC4]/0 to-100% pointer-events-none" />
      <div className="container relative z-1 flex flex-col justify-center items-center py-15 text-white">
        <h1 className="mb-0 text-center font-semibold text-[42px]/[50px] md:text-[46px]/[55px] lg:text-[56px]/[1.2]">
          <span className="block mx-auto gradient-text-white">
            Vara Network
          </span>{" "}
          documentation portal
        </h1>
        <div className="mt-4 text-base md:text-[18px]/[24px] font-medium space-y-4 *:mb-0">
          <p>All documentation related to Vara Network</p>
        </div>
        <div className="mt-12 mb-0">
          <Link className="btn btn--primary" to="/docs/welcome">
            Discover Vara
          </Link>
        </div>
      </div>
    </header>
  );
}
