import { JSX } from "preact/jsx-runtime";

type Props = {
  items: { q: string; a: JSX.Element }[];
};

export const QAList = ({ items }: Props) => {
  return (
    <>
      {items.map((item) => {
        return (
          <>
            <h3 id="expiry" class="font-bold mt-6">
              {item.q}
            </h3>
            <p class="ml-2 mt-2">
              {item.a}
            </p>
          </>
        );
      })}
    </>
  );
};
