import { Signal, signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { Link } from "../components/Link.tsx";
import ProgressBar from "../components/ProgressBar.tsx";
import { InlineCode } from "../components/InlineCode.tsx";
import { Details } from "../components/Details.tsx";
import { List } from "../components/List.tsx";
import { Spacer } from "../components/Spacer.tsx";

interface CounterProps {
  count: Signal<number>;
}

const progress = signal(0);

export default function DocumentCounter({ count }: CounterProps) {
  useEffect(() => {
    (async () => {
      const token_count = await (await fetch("/api/token-count")).json();

      count.value = token_count.api_tokens_count;
      progress.value = Math.ceil(
        (count.value / token_count.max_api_tokens) * 100,
      );
    })();
  });

  return (
    <div class="flex-col gap-8 py-6 w-[56ch]">
      <p class="flex-initial text-3xl tabular-nums text-center">
        This instance is serving {count} feeds!
      </p>
      <ProgressBar
        completed={progress.value}
        bgColor="green"
      />
      <p class="flex-initial">
        when this reaches 100%{" "}
        it is no longer possible to generate new feeds. You can wait a while and
        hope some of the current ones expire, or you can{" "}
        <Link href="https://github.com/trustmysoftware/rsssf">
          host your own RSSSF instance
        </Link>.
      </p>
      <Spacer />
      <Details summary="What does RSSSF do?">
        <List
          items={[
            <>
              Creates an atom/RSS feed for the releases of software hosted on
              Github.
            </>,
            <>
              Filters out <InlineCode>prerelease</InlineCode> and{" "}
              <InlineCode>draft</InlineCode> from feeds.
            </>,
            <>
              Filters out the releases whose semver doesn't match the one you
              select for. So if you select <InlineCode>major</InlineCode>{" "}
              you should not get <InlineCode>minor</InlineCode> or{" "}
              <InlineCode>patch</InlineCode> releases in your feed.
            </>,
          ]}
        />
      </Details>
      <Details summary="FAQ">
        <>
          <h3 class="font-bold">
            I have multiple devices, how do I best utilize this service?
          </h3>
          <p class="ml-2 mt-2">
            It's recommended to use something like{" "}
            <Link href="https://www.freshrss.org/">FreshRSS</Link>{" "}
            as a "middleman" to aggregate all your feeds in one place before it
            gets distributed out to all your devices, this way you can manage
            them in a single place, and you'll only "use" a single feed on this
            service as well (per software & semver pairing). Win-win!
          </p>
        </>
      </Details>
    </div>
  );
}
