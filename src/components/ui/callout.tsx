"use client";
import {
  Callout as BaseCallout,
  CalloutContainer,
  CalloutDescription,
  CalloutTitle,
} from "fumadocs-ui/components/callout";
import { Info } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export interface CalloutProps extends ComponentProps<typeof BaseCallout> {
  /**
   * Variant for custom display styles
   * @default 'default'
   */
  variant?: "default" | "compact" | "bordered" | "minimal";
}

// Extended alias resolution function
function resolveExtendedAlias(type: string): string {
  if (type === "warn") return "warning";
  if (type === "tip") return "info";
  if (type === "important") return "warning"; // Maps to warning
  if (type === "note") return "info"; // Keep for custom handling with muted colors
  return type;
}

export function Callout({
  variant = "default",
  className,
  type,
  ...props
}: CalloutProps) {
  const variantClasses = {
    default: "",
    compact: "py-2 px-3 text-sm",
    bordered: "border-2 border-fd-border",
    minimal: "bg-transparent border-none shadow-none",
  };

  // Resolve type alias
  const resolvedType = resolveExtendedAlias(type || "info");

  // For all other types, use BaseCallout with resolved type
  return (
    <BaseCallout
      type={resolvedType as any}
      className={cn(variantClasses[variant], className)}
      {...props}
    />
  );
}
