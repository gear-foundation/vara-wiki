import Link from "@docusaurus/Link";
import {
  FeatureItem,
  FEATURES_DATA,
} from "@site/src/components/homepage/features.data";

export default function HomepageFeatures() {
  return (
    <section className="flex-1 flex justify-center items-center pt-20">
      <div className="container grid md:grid-cols-2 gap-8">
        {FEATURES_DATA.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}

function Feature({ title, img, description, url }: FeatureItem) {
  return (
    <div className="flex flex-col md:items-center md:flex-row gap-x-6 gap-y-8">
      <div className="shrink-0">
        <img
          src={img}
          className="size-[170px]"
          role="img"
          alt={`${title} logo`}
        />
      </div>
      <div className="grow flex flex-col text-[#111111] dark:text-white space-y-2.5">
        <h3 className="text-[21px]/6 m-0">{title}</h3>
        <p className="text-base/[1.3] min-h-15 m-0 opacity-80">{description}</p>

        <Link
          className="btn btn--black-tonal dark:btn--white-tonal mt-0 w-fit text-sm/5 px-4 py-1.5"
          to={url}
        >
          Learn more
        </Link>
      </div>
    </div>
  );
}
