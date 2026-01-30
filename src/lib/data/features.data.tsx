import type { ReactNode } from "react";

export type FeatureItem = {
  title: string;
  img: string;
  description: ReactNode;
  url: string;
};

export const FEATURES_DATA: FeatureItem[] = [
  {
    title: "Vara Network",
    img: "/img/develop.svg",
    description: (
      <>
        Documentation for the Vara Network: accounts, node, staking, governance,
        tokenomics, bridge, and more.
      </>
    ),
    url: "/docs/vara-network",
  },
  {
    title: "Vara.eth",
    img: "/img/tokenomics.svg",
    description: (
      <>
        Vara.eth Wiki: build, deploy, and integrate with the Vara.eth
        ecosystem. Content coming soon.
      </>
    ),
    url: "/docs/vara-eth",
  },
  {
    title: "Developing on Vara",
    img: "/img/validate.svg",
    description: (
      <>
        Develop programs with Gear IDEA, Sails-JS, Gear-JS API, and Gear-CLI.
        From introduction to deployment and testing.
      </>
    ),
    url: "/docs/developing",
  },
];
