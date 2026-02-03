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
    img: "/img/favicon.svg",
    description: (
      <>
        Documentation for the L1 Vara Network: accounts, node, staking, governance,
        tokenomics, bridge, and more.
      </>
    ),
    url: "/docs/vara-network",
  },
  {
    title: "Vara.eth",
    img: "/img/ve-logo-light.svg",
    description: (
      <>
        Vara.eth: build, deploy, and integrate apps in the Ethereum ecosystem.
      </>
    ),
    url: "/docs/vara-eth",
  },
  {
    title: "Developing on Vara",
    img: "/img/validate.svg",
    description: (
      <>
        Develop programs with Gear Sails, Sails-JS, Gear-JS API, and Gear-CLI.
        From introduction to deployment and testing.
      </>
    ),
    url: "/docs/developing",
  },
];
