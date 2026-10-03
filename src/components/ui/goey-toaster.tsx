"use client";

import { GooeyToaster as GooeyToasterPrimitive, gooeyToast } from "goey-toast";
import type { GooeyToasterProps } from "goey-toast";
import "goey-toast/styles.css";

export { gooeyToast, gooeyToast as goeyToast };
export type { GooeyToasterProps };
export type {
  GooeyToastOptions,
  GooeyPromiseData,
  GooeyToastAction,
  GooeyToastClassNames,
  GooeyToastTimings,
} from "goey-toast";

export function GooeyToaster(props: GooeyToasterProps) {
  return (
    <GooeyToasterPrimitive
      position="top-center"
      preset="bouncy"
      swipeToDismiss={true}
      {...props}
    />
  );
}
