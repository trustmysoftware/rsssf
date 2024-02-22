import { JSX } from "preact/jsx-runtime";

export const List = ({ items }: { items: JSX.Element[] }) => {
  return (
    <ul>
      {items.map((i) => {
        return <li class="list-disc m-2 mx-8">{i}</li>;
      })}
    </ul>
  );
};
