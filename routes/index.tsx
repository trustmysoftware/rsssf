import { useSignal } from "@preact/signals";
import DocumentCounter from "../islands/DocumentCounter.tsx";

export default function Home() {
  const count = useSignal(0);
  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <DocumentCounter count={count} />
      </div>
    </div>
  );
}
