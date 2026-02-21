import { Image } from "fumadocs-core/framework";
import {
  ImageZoom,
  type ImageZoomProps,
} from "fumadocs-ui/components/image-zoom";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/ui/callout";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
      const p = props as React.ImgHTMLAttributes<HTMLImageElement> & {
        "data-no-zoom"?: boolean;
      };
      const { alt = "", ...rest } = p;
      if (p.className?.includes?.("no-zoom") || p["data-no-zoom"]) {
        return <Image alt={alt} {...(rest as unknown as ImageZoomProps)} />;
      }
      return <ImageZoom alt={alt} {...(rest as unknown as ImageZoomProps)} />;
    },
    pre: ({ children, ...props }: React.ComponentProps<'pre'>) => {
      // Check if it's a mermaid code block
      const codeElement = children as any;
      const className = codeElement?.props?.className || '';
      const language = className.replace(/language-/, '');
      
      if (language === 'mermaid') {
        const code = codeElement?.props?.children;
        return <Mermaid chart={code} />;
      }
      
      // For other code blocks, use default pre component
      const DefaultPre = defaultMdxComponents.pre || 'pre';
      return <DefaultPre {...props}>{children}</DefaultPre>;
    },
    Callout,
    ...components,
  };
}
