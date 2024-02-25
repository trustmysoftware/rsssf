import { useSignal } from "@preact/signals";
import DocumentCounter from "../islands/DocumentCounter.tsx";
import { FeedSelection } from "../islands/FeedSelection.tsx";
import { Page } from "../components/Page.tsx";
import { GH_Icon } from "../icons/github.tsx";
import { Link } from "../components/Link.tsx";

export default function Home() {
  const count = useSignal(0);
  return (
    <Page
      footer={
        <>
          <div class="m-10 text-red-800 flex items-center justify-between">
            <div>
              RSSSF - RSS Simple Software Semver Feed
            </div>
            <Link
              class="flex items-center text-red-800 visited:text-red-800"
              href="https://github.com/trustmysoftware/rsssf"
              icon={<GH_Icon color="rgb(153 27 27 / var(--tw-text-opacity))" />}
            >
              source
            </Link>
          </div>
        </>
      }
    >
      <div class="flex px-4 py-8 mx-auto bg-[#86efac] justify-center">
        <div class="w-[56ch] flex flex-col items-center justify-center">
          <FeedSelection />
        </div>
      </div>
      <div class="flex justify-around px-4 py-8">
        <DocumentCounter count={count} />
      </div>
    </Page>
  );
}
