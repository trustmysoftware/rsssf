import { JSX } from "preact/jsx-runtime";

type Props = {
  footer?: JSX.Element | JSX.Element[];
  children?: JSX.Element | JSX.Element[];
};

export const Page = ({ footer, children }: Props) => {
  return (
    <div class="m-0 p-0">
      <div class="min-h-[100lvh]">
        {children}
      </div>
      {footer && (
        <div class="bg-pink-100 border-transparent border">
          {footer}
        </div>
      )}
    </div>
  );
};
