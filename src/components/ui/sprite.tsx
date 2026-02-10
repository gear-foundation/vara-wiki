import { cn } from "@/lib/cn";

type SpriteProps = {
  name: string;
  className?: string;
  section?: string;
  size?: number;
} & React.SVGProps<SVGSVGElement>;

export function Sprite({
  name,
  className,
  section = "icons",
  size,
  ...props
}: SpriteProps) {
  const width = size || props.width;
  const height = size || props.height;

  return (
    <svg
      className={cn("inline-block", className)}
      width={width}
      height={height}
      {...props}
    >
      <use href={`/sprites/${section}.svg#${name}`} />
    </svg>
  );
}
