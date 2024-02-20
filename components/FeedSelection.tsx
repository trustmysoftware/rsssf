import { signal } from "@preact/signals";
import { Button } from "./Button.tsx";
import { Input } from "./Input.tsx";
import { Link } from "./Link.tsx";
import { Radio } from "./Radio.tsx";

const href = signal<string | null>(null);

export const FeedSelection = () => {
  return (
    <div className={"w-full flex flex-col gap-3"}>
      <Radio
        legend="Semver version"
        options={[{
          label: "Major",
          value: "major",
        }, {
          label: "Minor",
          value: "minor",
        }, {
          label: "Patch",
          value: "patch",
        }]}
        inline
      />
      <Input label="Repository URL" />
      <Button>Get Feed</Button>
      {href.value && <Link href={href.value} />}
    </div>
  );
};
