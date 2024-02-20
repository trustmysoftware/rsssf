import { useSignal } from "@preact/signals";
import { FeedSelection } from "../components/FeedSelection.tsx";
import DocumentCounter from "../islands/DocumentCounter.tsx";

export default function Home() {
  const count = useSignal(0);
  return (
    <>
      <div class="flex px-4 py-8 mx-auto bg-[#86efac] justify-center">
        <div class="w-[56ch] flex flex-col items-center justify-center">
          <FeedSelection />
        </div>
      </div>
      <div class="flex justify-around">
        <DocumentCounter count={count} />
      </div>
    </>
  );
}
