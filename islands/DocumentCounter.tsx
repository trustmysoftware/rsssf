import { Signal, signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { Link } from "../components/Link.tsx";
import ProgressBar from "../components/ProgressBar.tsx";
import { InlineCode } from "../components/InlineCode.tsx";
import { Details } from "../components/Details.tsx";
import { List } from "../components/List.tsx";
import { Spacer } from "../components/Spacer.tsx";
import { QAList } from "../components/QAList.tsx";

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
        When this reaches 100%{" "}
        the instance will no longer generate new feeds. You can wait a while and
        hope some of the current ones{" "}
        <Link href="#expiry">expire</Link>, or you can{" "}
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
              <InlineCode>draft</InlineCode> releases from feeds.
            </>,
            <>
              Filters out the releases whose semver are lower in rank than the
              one you select for. So if you select{" "}
              <InlineCode>minor</InlineCode> you should not get{" "}
              <InlineCode>patch</InlineCode> releases, but you <em>will</em> get
              {" "}
              <InlineCode>minor</InlineCode> and <InlineCode>major</InlineCode>
              {" "}
              ones.
            </>,
          ]}
        />
      </Details>
      <Details summary="I have questions...">
        <QAList
          items={[
            {
              q: "What is meant by expiry?",
              a: (
                <>
                  Feeds expire. This is to free up <em>unused</em>{" "}
                  feeds so that they can go back into the pool of available
                  feeds. The expiry time should currently be set to a period
                  much longer than the regular polling frequency of most RSS
                  readers. Whenever the feed is fetched, the{" "}
                  <InlineCode>expireAt</InlineCode>{" "}
                  timestamp associated with that feed is increased.
                </>
              ),
            },
            {
              q: "I have multiple devices, do I create a bunch of identical feeds?",
              a: (
                <>
                  It's recommended to use something like{" "}
                  <Link href="https://www.freshrss.org/">FreshRSS</Link>{" "}
                  as a "middleman" to aggregate all your feeds in one place
                  before it gets distributed out to all your devices, this way
                  you can manage them in a single place, and you'll only "use" a
                  single feed on this service as well (per software & semver
                  pairing). Win-win!
                </>
              ),
            },
            {
              q: "I have other questions...",
              a: (
                <>
                  <Link href="https://github.com/trustmysoftware/rsssf/issues/new/choose">
                    Create an issue
                  </Link>{" "}
                  or{" "}
                  <Link href="https://github.com/trustmysoftware/rsssf/discussions/new?category=general">
                    Start a discussion
                  </Link>.
                </>
              ),
            },
          ]}
        />
      </Details>
    </div>
  );
}
