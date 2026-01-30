import defaultMdxComponents from 'fumadocs-ui/mdx';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import type { MDXComponents } from 'mdx/types';
import { Callout } from '@/components/ui/callout';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
      const p = props as React.ImgHTMLAttributes<HTMLImageElement> & { 'data-no-zoom'?: boolean };
      if (p.className?.includes?.('no-zoom') || p['data-no-zoom']) {
        return <img {...p} />;
      }
      return <ImageZoom {...(p as any)} />;
    },
    Callout,
    ...components,
  };
}
