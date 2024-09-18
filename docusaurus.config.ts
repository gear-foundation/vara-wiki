import { themes as prismThemes } from "prism-react-renderer";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { type Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Vara Network Documentation Portal",
  tagline: "All documentation related to Vara Network",
  url: "https://wiki.vara.network/",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.svg",
  organizationName: "Gear Foundation",
  projectName: "vara-wiki",
  trailingSlash: false,

  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  plugins: [
    "docusaurus-plugin-sass",
    async function tailwindPlugin(context, options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
  ],
  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.js",
          editUrl: "https://github.com/gear-foundation/vara-wiki/edit/master",
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.scss",
        },
        googleTagManager: {
          containerId: "GTM-NH2N6VX",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: "dark",
    },
    image: "img/ogimage.jpg",
    navbar: {
      logo: {
        alt: "Vara Network Documentation Portal",
        src: "img/logo-vara.svg",
        srcDark: "img/logo-vara.svg",
      },
      items: [
        {
          type: "doc",
          docId: "welcome",
          position: "left",
          label: "Docs",
        },
        {
          href: "https://www.vara.network/",
          label: "Vara.network",
          position: "right",
        },
        {
          href: "https://www.gear-tech.io/",
          label: "Gear-tech.io",
          position: "right",
        },
        {
          href: "https://github.com/gear-foundation/vara-wiki",
          label: "Contribute",
          position: "right",
        },
      ],
    },
    announcementBar: {
      id: "varathon",
      content:
        'Ready to build on the edge of Web3? Join Vara online hackathon - <a target="_blank" href="https://varathon.io/?utm_source=wiki&utm_medium=banner&utm_campaign=vara"> Gear Up</a>',
      isCloseable: false,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    docs: {
      sidebar: {
        autoCollapseCategories: true,
      },
    },

    algolia: {
      appId: "B00UWUB92M",
      apiKey: "22579656b62b7175a3070ec7c5c7039d",
      indexName: "vara",
      contextualSearch: true,
      searchParameters: {},
      searchPagePath: "search",
    },
  } satisfies Preset.ThemeConfig,
  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
    "https://fonts.googleapis.com/css2?family=Anuphan:wght@100..700&display=swap",
  ],
  scripts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.11/iframeResizer.contentWindow.min.js",
      defer: true,
    },
    {
      src: "/js/with-iframe-resizer.js",
      defer: true,
    },
    // {
    //   src: 'https://cdn.jsdelivr.net/npm/@iframe-resizer/child',
    //   defer: true,
    // },
  ],
};

export default config;
