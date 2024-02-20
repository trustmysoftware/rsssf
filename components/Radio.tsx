import { Signal } from "@preact/signals";
import { clsx as cl } from "cl";
import { useEffect, useId, useRef } from "preact/hooks";

type Props = {
  legend: string;
  options: {
    label: string;
    value: string;
  }[];
  inline?: boolean;
  data: Signal<string | null>;
};

const Option = (
  { inline, option, data, name }: {
    inline: boolean;
    option: Props["options"][0];
    data: Props["data"];
    name: string;
  },
) => {
  const id = `option-${useId()}`;
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current?.checked) {
      data.value = ref.current?.value || "";
    }
  }, []);

  return (
    <div class={cl("relative py-2", { "inline-block": inline })}>
      <input
        type="radio"
        id={id}
        name={name}
        value={option.value}
        class="m-2 h-6 w-6 absolute top-0"
        onChange={(e) => {
          data.value = e.currentTarget.value;
        }}
        ref={ref}
      />
      <label
        for={id}
        class="p-2 py-3 before:h-2 before:w-8 before:inline-block"
      >
        {option.label}
      </label>
    </div>
  );
};

export const Radio = ({ legend, options, inline = false, data }: Props) => {
  const name = `radio-${useId()}`;

  return (
    <fieldset>
      <legend class="block font-bold">{legend}</legend>
      {options.map((option) => {
        return (
          <Option inline={inline} option={option} data={data} name={name} />
        );
      })}
    </fieldset>
  );
};
