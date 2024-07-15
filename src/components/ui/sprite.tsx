import { SVGProps } from "react";
import { cn } from "@site/src/lib/utils";

export type SpriteProps = SVGProps<SVGSVGElement> & {
  name: string;
  section?: string;
  size?: number;
};

export function Sprite({
  name,
  className,
  section = "icons",
  size,
  ...props
}: SpriteProps) {
  return (
    <svg
      className={cn("size-full", className)}
      width={size || props.width}
      height={size || props.height}
      style={{ width: size || props.width, height: size || props.height }}
      {...props}
    >
      <use href={`/sprites/${section}.svg?v=2&sprite#${name.toLowerCase()}`} />
    </svg>
  );
}
