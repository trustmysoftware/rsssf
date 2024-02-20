import clsx from "cl";

type Props = {
  bgColor: string;
  completed: number;
};

const ProgressBar = ({ bgColor, completed }: Props) => {
  const fillerStyles = {
    width: `${completed}%`,
    backgroundColor: bgColor,
  };

  return (
    <div class="rounded-full bg-gray-200 h-7 w-full my-2">
      <div class="rounded-full text-right h-full relative" style={fillerStyles}>
        <span
          class={clsx("font-bold absolute", {
            ["text-black right-[-2.5rem]"]: completed < 10,
            ["text-white right-1"]: completed >= 10,
          })}
        >
          {`${completed}%`}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
