import { signal } from "@preact/signals";
import { Button } from "../components/Button.tsx";
import { Input } from "../components/Input.tsx";
import { Link } from "../components/Link.tsx";
import { Radio } from "../components/Radio.tsx";

type Semver = "major" | "minor" | "patch";

const href = signal<string | null>(null);
const repository_url = signal("");
const semver_selection = signal<Semver | null>(null);

const createFeedURL = async () => {
  const api_token = await (await fetch("/api/generate-token")).text();

  const params = new URLSearchParams();
  params.set("q", repository_url.value);
  params.set("key", api_token);

  href.value = `/${semver_selection.value}?${params}`;
};

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
        data={semver_selection}
      />
      <Input label="Repository URL" data={repository_url} />
      <Button onClick={createFeedURL}>Get Feed</Button>
      {href.value && <Link href={href.value} />}
    </div>
  );
};
