import { JSX } from "preact/jsx-runtime";

export const openDetailsIfAnchorHidden = (
  evt: JSX.TargetedEvent<HTMLAnchorElement>,
) => {
  const targetA = evt?.target as HTMLAnchorElement;
  const targetDIV: HTMLElement | null = document.querySelector(
    targetA.getAttribute("href")!,
  );
  if (!!targetDIV?.offsetHeight || targetDIV?.getClientRects().length) return;
  const closestDetails = targetDIV?.closest("details");
  if (!closestDetails) return;
  closestDetails.open = true;
};
