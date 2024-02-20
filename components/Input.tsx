import { Signal } from "@preact/signals";
import { useEffect, useId, useRef } from "preact/hooks";

export const Input = (
  { label, readOnly, data }: {
    label: string;
    readOnly?: boolean;
    data: Signal<string>;
  },
) => {
  const id = `input-${useId()}`;
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    data.value = ref.current?.value || "";
  }, []);

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
        onInput={(e) => {
          data.value = e.currentTarget.value;
        }}
        ref={ref}
      />
    </div>
  );
};
