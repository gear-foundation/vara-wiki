import type { ReactNode } from "react";

export type FeatureItem = {
  title: string;
  img: string;
  description: ReactNode;
  url: string;
};

export const FEATURES_DATA: FeatureItem[] = [
  {
    title: "Start developing",
    img: "/images/develop.svg",
    description: (
      <>
        Are you developer? Start building a new generation of Web3 applications
        right now.
        <br />
        <br />
      </>
    ),
    url: "/docs/build",
  },
  {
    title: "Become a Validator",
    img: "/images/validate.svg",
    description: (
      <>
        Provide computing resources to keep the Vara Network secure, performant
        and censorship-resistant. It is not only a responsibility, but also a
        good reward.
      </>
    ),
    url: "/docs/staking/validate",
  },
  {
    title: "Become a Nominator",
    img: "/images/nominate.svg",
    description: (
      <>
        Help maintain the network security by participating as a nominator.
        Stake your VARA and get reward!
        <br />
        <br />
      </>
    ),
    url: "/docs/staking/nominate",
  },
  {
    title: "Explore Vara's Token Economy",
    img: "/images/tokenomics.svg",
    description: (
      <>
        Learn how every transaction and stake contributes to a robust network.
        From incentives to governance, Vara opens doors to a new era in
        decentralized networks.
      </>
    ),
    url: "/docs/tokenomics",
  },
];
