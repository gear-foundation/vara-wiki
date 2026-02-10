import fs from "node:fs/promises";
import path from "node:path";
import { EXTERNAL_LINKS } from "@/lib/data/external";

type PageLike = {
  path: string;
  absolutePath?: string;
  data?: {
    body?: unknown;
    getText?: (format: "raw" | "processed") => Promise<string>;
  };
};

const stripFrontmatter = (content: string) =>
  content.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, "");

const splitUrl = (rawUrl: string) => {
  const match = /^([^?#]*)([?#].*)?$/.exec(rawUrl);
  return {
    pathPart: match?.[1] ?? rawUrl,
    suffix: match?.[2] ?? "",
  };
};

const toAbsoluteUrl = (rawUrl: string, pagePath: string) => {
  const trimmed = rawUrl.trim();
  if (!trimmed) return rawUrl;
  if (/^(https?:)?\/\//i.test(trimmed)) return rawUrl;
  if (/^(data|mailto|tel|sms):/i.test(trimmed)) return rawUrl;
  if (trimmed.startsWith("#")) return rawUrl;

  const { pathPart, suffix } = splitUrl(trimmed);
  let resolvedPath = pathPart;
  if (pathPart.startsWith("/")) {
    resolvedPath = pathPart;
  } else {
    const dir = path.posix.dirname(pagePath);
    resolvedPath = path.posix.normalize(
      path.posix.join("/", dir === "." ? "" : dir, pathPart),
    );
  }

  return `${EXTERNAL_LINKS.wikiVara.replace(/\/$/, "")}${resolvedPath}${suffix}`;
};

const rewriteRelativeUrls = (content: string, pagePath: string) => {
  const applyRewrites = (segment: string) => {
    const withMarkdown = segment.replace(
      /(!?)\[([^\]]*)\]\(([^)\s]+)([^)]*)\)/g,
      (match, bang, text, url, trailing) => {
        const nextUrl = toAbsoluteUrl(url, pagePath);
        if (nextUrl === url) return match;
        return `${bang}[${text}](${nextUrl}${trailing})`;
      },
    );

    const withHtml = withMarkdown
      .replace(/\b(src|href)=("([^"]+)")/g, (match, attr, wrapped, url) => {
        const nextUrl = toAbsoluteUrl(url, pagePath);
        if (nextUrl === url) return match;
        return `${attr}=${wrapped.replace(url, nextUrl)}`;
      })
      .replace(
        /\b(src|href)=\{(['"])([^'"]+)\2\}/g,
        (match, attr, quote, url) => {
          const nextUrl = toAbsoluteUrl(url, pagePath);
          if (nextUrl === url) return match;
          return `${attr}={${quote}${nextUrl}${quote}}`;
        },
      );

    return withHtml;
  };

  const parts = content.split(/```/g);
  for (let i = 0; i < parts.length; i += 2) {
    parts[i] = applyRewrites(parts[i]);
  }
  return parts.join("```");
};

const resolveAbsolutePath = (pagePath: string, absolutePath?: string) =>
  absolutePath ?? path.join(process.cwd(), "content/docs", pagePath);

export async function getPageBodyWithAbsoluteUrls(page: PageLike) {
  const pagePath = page.path;
  const absolutePath = resolveAbsolutePath(pagePath, page.absolutePath);

  try {
    const raw = await fs.readFile(absolutePath, "utf8");
    return rewriteRelativeUrls(stripFrontmatter(raw), pagePath);
  } catch {
    const pageData = page.data;
    let fallbackBody = "";
    if (typeof pageData?.body === "string") {
      fallbackBody = pageData.body;
    } else if (typeof pageData?.getText === "function") {
      try {
        fallbackBody = await pageData.getText("raw");
      } catch {
        fallbackBody = (await pageData.getText("processed")) ?? "";
      }
    }
    return rewriteRelativeUrls(fallbackBody, pagePath);
  }
}
