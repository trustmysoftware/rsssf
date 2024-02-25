import { JSX } from "preact/jsx-runtime";

type Props = {
  footer?: JSX.Element | JSX.Element[];
  children?: JSX.Element | JSX.Element[];
};

export const Page = ({ footer, children }: Props) => {
  return (
    <>
      <div class="min-h-[100lvh] min-h-[100vh]">
        {children}
      </div>
      {footer && (
        <div class="bg-pink-100 border-transparent border">
          {footer}
        </div>
      )}
    </>
  );
};
