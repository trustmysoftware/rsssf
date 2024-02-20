import { JSX } from "preact";

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  const classString =
    `w-fit px-2 py-1 border-gray-500 border-2 rounded bg-white hover:bg-gray-200 transition-colors ${props.className}`;

  return (
    <button
      {...props}
      class={classString}
    />
  );
}
