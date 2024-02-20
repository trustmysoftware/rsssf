import { JSX } from "preact/jsx-runtime";

export const Link = (
  { href, children }: { href: string; children?: string },
) => {
  return <a href={href}>{children ? children : href}</a>;
};
