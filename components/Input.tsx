import { useId } from "preact/hooks";

export const Input = (
  { label, readOnly }: { label: string; readOnly?: boolean },
) => {
  const id = `input-${useId()}`;

  return (
    <div className="w-full flex flex-col">
      <label className="flex-initial block font-bold" for={id}>
        {label}
      </label>
      <input
        className="flex-initial p-1"
        id={id}
        type="text"
        readOnly={readOnly}
      />
    </div>
  );
};
