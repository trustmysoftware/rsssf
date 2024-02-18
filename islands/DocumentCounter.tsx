import type { Signal } from "@preact/signals";
import { useEffect } from "preact/hooks";

interface CounterProps {
  count: Signal<number>;
}

export default function DocumentCounter(props: CounterProps) {
  useEffect(() => {
    (async () => {
      const document_count = await fetch("/api/document-count");
      props.count.value = parseInt(
        await document_count.text(),
      );
    })();
  });

  return (
    <div class="flex gap-8 py-6">
      <p class="text-3xl tabular-nums">There are {props.count} tokens</p>
    </div>
  );
}
