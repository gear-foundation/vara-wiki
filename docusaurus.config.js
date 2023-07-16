// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Vara Network Documentation Portal',
  tagline: 'All documentation related to Vara Network',
  url: 'https://wiki.vara-network.io/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.svg',
  organizationName: 'Gear Technologies',
  projectName: 'vara-wiki',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/gear-foundation/vara-wiki/edit/master',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark'
      },
      navbar: {
        logo: {
          alt: 'Vara Network',
          src: 'img/logo-vara-green.svg',
          srcDark: "img/logo-vara.svg"
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://www.vara-network.io/',
            label: 'Vara-network.io',
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
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      googleTagManager: {
        containerId: 'GTM-NH2N6VX',
      },
    }),
};

module.exports = config;
