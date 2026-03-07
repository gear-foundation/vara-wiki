/**
 * Maps the first URL path segment to a section name.
 * Section name is used as body class and as CSS variable suffix (e.g. --vara-network-color).
 */
export function getSection(path: string | undefined): string {
  if (!path) return "vara-network";
  const [dir] = path.split("/", 1);
  if (!dir) return "vara-network";
  return (
    {
      "gear": "gear",
      "vara-network": "vara-network",
      "vara-eth": "vara-eth",
      "developing": "developing",
    }[dir] ?? "vara-network"
  );
}

/**
 * Returns section name from a docs URL (e.g. /docs/vara-network/... -> vara-network).
 * Used for sidebar tab icon colors.
 */
export function getSectionFromUrl(url: string): string {
  const segment = url.replace(/^\/docs\/?/, "").split("/")[0];
  return getSection(segment);
}
