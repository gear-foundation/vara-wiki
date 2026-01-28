import Image from "next/image";
import Link from "next/link";
import { FEATURES_DATA, type FeatureItem } from "@/lib/data/features.data";

export function HomepageFeatures() {
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
        <Image
          src={img}
          className="size-[170px]"
          alt={`${title} logo`}
          width={170}
          height={170}
        />
      </div>
      <div className="grow grid text-[#111111] dark:text-white gap-y-2.5">
        <h3 className="text-[21px]/6 font-bold">{title}</h3>
        <p className="text-base/[1.3] min-h-15 opacity-80">{description}</p>

        <Link
          className="btn btn--black-tonal dark:btn--white-tonal mt-0 w-fit text-sm/5 px-4 py-1.5"
          href={url}
        >
          Learn more
        </Link>
      </div>
    </div>
  );
}
