import { clsx as cl } from "cl";
import { useId } from "preact/hooks";

type Props = {
  legend: string;
  options: {
    label: string;
    value: string;
  }[];
  inline?: boolean;
};

export const Radio = ({ legend, options, inline = false }: Props) => {
  const name = `radio-${useId()}`;

  return (
    <fieldset>
      <legend class="block font-bold">{legend}</legend>
      {options.map((option) => {
        const id = `option-${useId()}`;
        return (
          <div class={cl("relative py-2", { "inline-block": inline })}>
            <input
              type="radio"
              id={id}
              name={name}
              value={option.value}
              class="m-2 h-6 w-6 absolute top-0"
            />
            <label
              for={id}
              class="p-2 py-3 before:h-2 before:w-8 before:inline-block"
            >
              {option.label}
            </label>
          </div>
        );
      })}
    </fieldset>
  );
};
