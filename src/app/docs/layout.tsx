import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";
import { getSectionFromUrl } from "@/lib/source/navigation";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      sidebar={{
        tabs: {
          transform(option, node) {
            const section = getSectionFromUrl(option.url);
            const color = `var(--docs-tab-${section}-color, var(--color-fd-foreground))`;

            return {
              ...option,
              icon: node.icon ? (
                <div
                  className="[&_svg]:size-full rounded-lg size-full text-[var(--tab-color)] max-md:bg-[var(--tab-color)]/10 max-md:border max-md:p-1.5"
                  style={{ "--tab-color": color } as React.CSSProperties}
                >
                  {node.icon}
                </div>
              ) : option.icon,
            };
          },
        },
      }}
    >
      {children}
    </DocsLayout>
  );
}
