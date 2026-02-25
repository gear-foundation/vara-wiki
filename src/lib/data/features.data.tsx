import type { ReactNode } from "react";

export type FeatureItem = {
  title: string;
  img: string;
  description: ReactNode;
  url: string;
};

export const FEATURES_DATA: FeatureItem[] = [
    {
    title: "Gear Protocol",
    img: "/images/gear-grey.png",
    description: (
      <>
        A modern technology for building decentralized systems and applications.
      </>
    ),
    url: "/docs/gear",
  },
  {
    title: "Vara Network",
    img: "/images/favicon.svg",
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
    img: "/images/ve-logo-light.svg",
    description: (
      <>
        Vara.eth: build, deploy, and integrate apps in the Ethereum ecosystem.
      </>
    ),
    url: "/docs/vara-eth",
  },
  {
    title: "Developing on Sails",
    img: "/images/validate.svg",
    description: (
      <>
        Learn how to develop programs for Vara and Vara.eth with Sails framework.
        From introduction to deployment and testing.
      </>
    ),
    url: "/docs/developing",
  },
];
