import { docs } from "fumadocs-mdx:collections/server";
import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `/og/docs/${segments.join("/")}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  // Note: getText might not be available in all versions
  // If it fails, use page.data.body or page.data.content instead
  const data = page.data as {
    getText?: (format: "raw" | "processed") => Promise<string>;
    body?: string;
  };
  try {
    const processed = await data.getText?.("processed");
    return `# ${page.data.title}\n\n${processed || ""}`;
  } catch {
    return `# ${page.data.title}\n\n${data.body || ""}`;
  }
}
