import { JSX } from "preact/jsx-runtime";

export const Link = (
  { href, children }: { href: string; children?: string },
) => {
  return (
    <a
      class="text-blue-500 visited:text-purple-500 hover:underline"
      href={href}
    >
      {children ? children : href}
    </a>
  );
};
