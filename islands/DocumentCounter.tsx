import { computed, Signal, signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { Link } from "../components/Link.tsx";
import ProgressBar from "../components/ProgressBar.tsx";
import { InlineCode } from "../components/InlineCode.tsx";

interface CounterProps {
  count: Signal<number>;
}

const progress = signal(0);

export default function DocumentCounter({ count }: CounterProps) {
  useEffect(() => {
    (async () => {
      const token_count = await (await fetch("/api/token-count")).json();

      console.log({ token_count });

      count.value = token_count.api_tokens_count;
      progress.value = Math.ceil(
        (count.value / token_count.max_api_tokens) * 100,
      );
    })();
  });

  return (
    <div class="flex-col gap-8 py-6 w-[56ch]">
      <p class="flex-initial text-3xl tabular-nums text-center">
        There are {count} tokens in use
      </p>
      <ProgressBar
        completed={progress.value}
        bgColor="green"
      />
      <p class="flex-initial">
        when this reaches 100%{" "}
        it is no longer possible to generate new tokens. You can wait a while
        and hope some of the current ones expire, or you can{" "}
        <Link href="https://github.com/trustmysoftware/rsssf">
          host your own RSSSF instance
        </Link>
      </p>
      <details>
        <summary class="my-4 mt-20">What does RSSSF do?</summary>
        <ul>
          <li class="list-disc m-2 mx-8">
            Creates an atom/RSS feed for software hosted on Github.
          </li>
          <li class="list-disc m-2 mx-8">
            Filters out <InlineCode>prerelease</InlineCode> and{" "}
            <InlineCode>draft</InlineCode> from feeds
          </li>
          <li class="list-disc m-2 mx-8">
            Filters out only the semver that matches the one you select for
          </li>
        </ul>
      </details>
    </div>
  );
}
