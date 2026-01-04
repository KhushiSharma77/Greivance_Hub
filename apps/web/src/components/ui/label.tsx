"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        [
          /* Layout */
          "flex items-center gap-2",

          /* Typography */
          "text-sm font-medium",
          "text-gray-700",

          /* Spacing & rhythm */
          "leading-tight",

          /* Interaction */
          "select-none",

          /* Disabled states */
          "group-data-[disabled=true]:opacity-50",
          "group-data-[disabled=true]:pointer-events-none",
          "peer-disabled:opacity-50",
          "peer-disabled:cursor-not-allowed",

          /* Subtle polish */
          "transition-colors duration-150",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

export { Label };
