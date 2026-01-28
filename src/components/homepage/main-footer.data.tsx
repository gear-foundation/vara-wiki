import { EXTERNAL_LINKS } from "@/lib/data/external";

export const FOOTER_NAVIGATION = [
  {
    id: "ecosystem",
    title: <>Ecosystem</>,
    list: [
      {
        title: "Ecosystem Hub",
        link: EXTERNAL_LINKS.varaStart,
      },
      {
        title: "Vara Network",
        link: EXTERNAL_LINKS.varaNetwork,
      },
      {
        title: "Vara.eth",
        link: EXTERNAL_LINKS.varaETH,
      },
      {
        title: "Gear Protocol",
        link: EXTERNAL_LINKS.gearTech,
      },
      {
        title: "VARA Token",
        link: EXTERNAL_LINKS.trade.coinbase,
      },
    ],
  },
  {
    id: "discover",
    title: (
      <>
        Discover <span className="sr-only">VARA</span>
      </>
    ),
    list: [
      {
        title: "Ecosystem",
        link: `${EXTERNAL_LINKS.varaNetwork}/ecosystem`,
      },
      {
        title: "Tokenomics",
        link: `${EXTERNAL_LINKS.varaNetwork}/tokenomics`,
      },
      {
        title: "Network Activity",
        link: `${EXTERNAL_LINKS.varaNetwork}/tokenomics/network`,
      },
      {
        title: "News",
        link: `${EXTERNAL_LINKS.varaNetwork}/news`,
      },
      {
        title: "Events",
        link: `${EXTERNAL_LINKS.varaNetwork}/events`,
      },
    ],
  },
  {
    id: "learn",
    title: (
      <>
        Learn <span className="sr-only">about VARA</span>
      </>
    ),
    list: [
      {
        title: "Vara Wiki",
        link: EXTERNAL_LINKS.wikiVara,
      },
      {
        title: "Interactive Tutorials",
        link: EXTERNAL_LINKS.tutorials,
      },
      {
        title: "Gear Whitepaper",
        link: EXTERNAL_LINKS.whitePaper,
      },
      {
        title: "Education Hub",
        link: `${EXTERNAL_LINKS.varaNetwork}/education`,
      },
    ],
  },
  {
    id: "build",
    title: (
      <>
        Build <span className="sr-only">with VARA</span>
      </>
    ),
    list: [
      {
        title: "Gear IDEA",
        link: EXTERNAL_LINKS.idea,
      },
      {
        title: "Developer portal",
        link: `${EXTERNAL_LINKS.varaNetwork}/developers`,
      },
      {
        title: "Grants",
        link: `${EXTERNAL_LINKS.varaNetwork}/grants`,
      },
      {
        title: "Varathon",
        link: EXTERNAL_LINKS.varathon,
      },
    ],
  },
  {
    id: "join",
    title: (
      <>
        Join <span className="sr-only">VARA</span>
      </>
    ),
    list: [
      {
        title: "Supporters",
        link: `${EXTERNAL_LINKS.varaNetwork}/supporters`,
      },
      {
        title: "Join Ambassador program",
        link: `${EXTERNAL_LINKS.varaNetwork}/ambassadors/apply`,
      },
      {
        title: "Validators",
        link: `${EXTERNAL_LINKS.varaNetwork}/validators`,
      },
      {
        title: "Build with Us",
        link: `${EXTERNAL_LINKS.varaNetwork}/ecosystem/submit`,
      },
      {
        title: "Vara Art",
        link: `${EXTERNAL_LINKS.varaNetwork}/varaArt`,
      },
    ],
  },
  {
    id: "network",
    title: (
      <>
        Network <span className="sr-only">with VARA</span>
      </>
    ),
    list: [
      {
        title: "Staking",
        link: `${EXTERNAL_LINKS.wikiVara}/docs/staking/`,
      },
      {
        title: "Vara NFT",
        link: "https://nft-showroom.vara.network/",
      },
      {
        title: "Press Kit",
        link: `${EXTERNAL_LINKS.varaNetwork}/pressKit`,
      },
      {
        title: "Anti-Scam",
        link: `${EXTERNAL_LINKS.varaNetwork}/antiScam`,
      },
    ],
  },
  {
    id: "inspect",
    title: (
      <>
        Inspect <span className="sr-only">VARA</span>
      </>
    ),
    list: [
      {
        title: "Validators Dashboard",
        link: EXTERNAL_LINKS.validatorsDashboard,
      },
      {
        title: "Node Telemetry",
        link: EXTERNAL_LINKS.telemetry,
      },
      {
        title: "Vara explorer (Subscan)",
        link: EXTERNAL_LINKS.varaSubscan,
      },
    ],
  },
];
