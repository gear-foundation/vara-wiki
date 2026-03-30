"use client";

import { useEffect, useId, useState } from "react";

type MermaidDiagramProps = {
  chart: string;
  className?: string;
};

let initialized = false;

export default function MermaidDiagram({
  chart,
  className,
}: MermaidDiagramProps) {
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function renderChart() {
      try {
        const mermaidLib = (await import("mermaid")).default;

        if (!initialized) {
          mermaidLib.initialize({
            startOnLoad: false,
            securityLevel: "strict",
            theme: "default",
          });
          initialized = true;
        }

        const result = await mermaidLib.render(`mermaid-${id}`, chart);

        if (!cancelled) {
          setSvg(result.svg);
        }
      } catch (error) {
        if (!cancelled) {
          setSvg(
            `<pre style="color:red; white-space:pre-wrap;">${
              error instanceof Error
                ? error.message
                : "Failed to render Mermaid diagram"
            }</pre>`
          );
        }
      }
    }

    renderChart();

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
