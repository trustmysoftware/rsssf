import { JSX } from "preact/jsx-runtime";

export const Link = (
  { href, children }: { href: string; children?: JSX.Element },
) => {
  return <a href={href}>{children ? children : href}</a>;
};
