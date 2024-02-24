import { openDetailsIfAnchorHidden } from "../clientside_utils/openDetails.ts";

export const Link = (
  { href, children }: { href: string; children?: string },
) => {
  return (
    <a
      class="text-blue-500 visited:text-purple-500 hover:underline"
      onClick={openDetailsIfAnchorHidden}
      href={href}
    >
      {children ? children : href}
    </a>
  );
};
