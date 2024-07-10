import {themes as prismThemes} from 'prism-react-renderer'

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default {
  title: 'Vara Network Documentation Portal',
  tagline: 'All documentation related to Vara Network',
  url: 'https://wiki.vara.network/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.svg',
  organizationName: 'Gear Foundation',
  projectName: 'vara-wiki',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: ['docusaurus-plugin-sass'],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/gear-foundation/vara-wiki/edit/master',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.scss',
        },
        googleTagManager: {
          containerId: 'GTM-NH2N6VX',
        },
      }),
    ],
  ],

  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
      },
      image: 'img/ogimage.jpg',
      navbar: {
        logo: {
          alt: 'Vara Network',
          src: 'img/logo-vara-green.svg',
          srcDark: 'img/logo-vara.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'welcome',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://www.vara.network/',
            label: 'Vara.network',
            position: 'right',
          },
          {
            href: 'https://www.gear-tech.io/',
            label: 'Gear-tech.io',
            position: 'right',
          },
          {
            href: 'https://github.com/gear-foundation/vara-wiki',
            label: 'Contribute',
            position: 'right',
          },
        ],
      },
      announcementBar: {
        id: 'varathon',
        content:
          'Ready to build on the edge of Web3? Join Vara online hackathon - <a target="_blank" href="https://varathon.io/?utm_source=wiki&utm_medium=banner&utm_campaign=vara"> Gear up</a>',
        backgroundColor: '#188269',
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
    }),
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
  scripts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.11/iframeResizer.contentWindow.min.js',
      defer: true,
    },
    {
      src: '/js/with-iframe-resizer.js',
      defer: true,
    },
    // {
    //   src: 'https://cdn.jsdelivr.net/npm/@iframe-resizer/child',
    //   defer: true,
    // },
  ],
}
