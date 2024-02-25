import clsx from "cl";
import { openDetailsIfAnchorHidden } from "../clientside_utils/openDetails.ts";
import { JSX } from "preact/jsx-runtime";

type Props = {
  href: string;
  children?: string;
  class: string;
  icon: JSX.Element;
};

export const Link = (
  { href, children, class: _class, icon: Icon }: Props,
) => {
  return (
    <a
      class={clsx(
        "text-blue-500 visited:text-purple-500 hover:underline",
        _class,
      )}
      onClick={openDetailsIfAnchorHidden}
      href={href}
    >
      {children ? children : href}
      {Icon && (
        <div class="m-1">
          {Icon}
        </div>
      )}
    </a>
  );
};
