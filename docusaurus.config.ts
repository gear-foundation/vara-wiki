import { themes as prismThemes } from "prism-react-renderer";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { type Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import fs from "node:fs";
import path from "node:path";

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
    pluginLlmsTxt,
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
          href: "https://vara.network/",
          label: "Vara.network",
          position: "right",
        },
        {
          href: "https://gear-tech.io/",
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

async function pluginLlmsTxt(context) {
  const baseURL = "https://wiki.vara.network/docs";
  return {
    name: "llms-txt-plugin",
    loadContent: async () => {
      const { siteDir } = context;
      const contentDir = path.join(siteDir, "docs");
      const docFiles = {};
      const allContent = [];

      // Regular expression to extract sidebar_label
      const sidebarLabelRegex = /sidebar_label:\s*(.+?)$/m;

      // Recursive function to collect all md and mdx files with their paths
      const getDocFiles = async (dir) => {
        try {
          const entries = await fs.promises.readdir(dir, {
            withFileTypes: true,
          });

          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
              await getDocFiles(fullPath);
            } else if (/\.(md|mdx)$/.test(entry.name)) {
              const content = await fs.promises.readFile(fullPath, "utf8");

              // Extract relative path from docs directory
              const relativePath = fullPath.replace(contentDir + path.sep, "");

              // Extract sidebar_label if present
              const sidebarLabelMatch = content.match(sidebarLabelRegex);
              if (sidebarLabelMatch) {
                const sidebarLabel = sidebarLabelMatch[1].trim();
                docFiles[relativePath] = {
                  path: relativePath,
                  title: sidebarLabel,
                };
              }

              // Generate source URL and prepend to content
              const sourcePath = sanitizePath(
                relativePath.replace(/\.(md|mdx)$/, ""),
              );
              const sourceLine = `<!-- Source: ${baseURL}/${sourcePath} -->`;

              // Insert source line after first heading
              const modifiedContent = `${sourceLine}\n\n${content}\n\n`;
              allContent.push(modifiedContent);
            }
          }
        } catch (err) {
          console.error(`Error reading directory ${dir}:`, err);
        }
      };

      await getDocFiles(contentDir);
      return { docFiles, allContent };
    },
    postBuild: async ({ content, outDir }) => {
      const { docFiles, allContent } = content;

      // Write concatenated content for full-text search
      const concatenatedPath = path.join(outDir, "llms-full.txt");
      await fs.promises.writeFile(
        concatenatedPath,
        allContent.join("\n\n---\n\n"),
      );

      // Organize docs by section (top-level directory)
      const docsBySection = {};
      Object.entries(docFiles).forEach(([path, data]) => {
        const section = path.split("/")[0];
        if (!docsBySection[section]) {
          docsBySection[section] = [];
        }
        docsBySection[section].push(data);
      });

      // Build llms.txt with organized sections
      let llmsTxt = `# ${context.siteConfig.title}\n\n`;
      llmsTxt += `> Documentation organized for LLM context\n\n`;
      llmsTxt += `## Docs\n\n`;

      // Sort sections alphabetically
      const sortedSections = Object.keys(docsBySection).sort();

      for (const section of sortedSections) {
        llmsTxt += `### ${section.charAt(0).toUpperCase() + section.slice(1)}\n\n`;

        // Sort docs within each section by title
        const sectionDocs = docsBySection[section].sort((a, b) =>
          a.title.localeCompare(b.title),
        );

        for (const doc of sectionDocs) {
          const urlPath = sanitizePath(doc.path.replace(/\.(md|mdx)$/, ""));
          llmsTxt += `- [${doc.title}](${baseURL}/${urlPath})\n`;
        }

        llmsTxt += "\n";
      }

      // Write llms.txt file
      const llmsTxtPath = path.join(outDir, "llms.txt");
      try {
        await fs.promises.writeFile(llmsTxtPath, llmsTxt);
        console.log(`✅ Successfully created ${llmsTxtPath}`);
      } catch (err) {
        console.error(`❌ Error writing llms.txt:`, err);
        throw err;
      }
    },
  };
}

function sanitizePath(base) {
  // Split path segments
  const segments = base.split("/");

  // Remove last segment if last two are identical
  if (
    segments.length >= 2 &&
    segments[segments.length - 1] === segments[segments.length - 2]
  ) {
    segments.pop();
  }

  // Rebuild URL with query parameters
  return segments.join("/");
}

export default config;
