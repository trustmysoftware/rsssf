import { JSX } from "preact/jsx-runtime";

export const Details = (
  { summary, children }: { summary: string; children: JSX.Element },
) => {
  return (
    <details>
      <summary class="my-4 mt-8">{summary}</summary>
      {children}
    </details>
  );
};
