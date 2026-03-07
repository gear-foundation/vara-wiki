import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared";
import { IconLogo } from "@/components/icons/icon-logo";

const LINKS: LinkItemType[] = [
  {
    text: "Vara Ecosystem",
    url: "https://start.vara.network/",
    external: true,
  },
  {
    text: "Gear Technologies",
    url: "https://gear-tech.io/",
    external: true,
  },
  {
    text: "Contribute",
    url: "https://github.com/gear-foundation/vara-wiki",
    external: true,
  },
];

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <IconLogo className="h-8 w-auto" />,
      url: "/",
    },
    githubUrl: "https://github.com/gear-tech/gear",
    links: LINKS,
  };
}

export function homepageOptions(): BaseLayoutProps {
  const options = baseOptions();
  const existingLinks = options.links ?? [];

  return {
    ...options,
    links: [
      {
        text: "Documentation",
        url: "/docs/vara-network",
      },
      ...existingLinks,
    ],
  };
}
