import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { z } from "zod";

// Remark plugin to replace unsupported languages with 'text' before Shiki processes them
const remarkReplaceUnsupportedLanguages: Plugin = () => {
  const unsupportedLangs = ["math", "circom", "env"];

  return (tree) => {
    visit(tree, "code", (node: any) => {
      if (node.lang && unsupportedLangs.includes(node.lang)) {
        node.lang = "text";
      }
    });
  };
};

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
// Using object destructuring for Zod v4 compatibility (recommended approach)
const customFrontmatterSchema = z.object({
  ...frontmatterSchema.shape,
  browser_title: z.string().optional(),
  custom_title: z.string().optional(),
});

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: customFrontmatterSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMath, remarkReplaceUnsupportedLanguages],
    rehypePlugins: (v) => [rehypeKatex, ...v],
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      // Map unsupported languages to text as fallback
      langAlias: {
        math: "text", // Math is handled by rehype-katex
        circom: "text", // Circom language not in Shiki bundle
        env: "text", // Env files not in Shiki bundle
      },
    },
  },
});
