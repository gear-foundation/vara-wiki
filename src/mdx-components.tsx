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
    Callout,
    ...components,
  };
}
