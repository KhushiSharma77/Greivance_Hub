import { Input as InputPrimitive } from "@base-ui/react/input";
import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        [
          /* Base layout */
          "w-full min-w-0",
          "h-10 px-4",

          /* Typography */
          "text-sm text-gray-800",
          "placeholder:text-gray-400",

          /* Shape */
          "rounded-xl",

          /* Glassmorphism */
          "bg-white/70 backdrop-blur-md",
          "border border-purple-200/60",

          /* Interaction */
          "transition-all duration-200 ease-out",
          "hover:border-purple-300",

          /* Focus */
          "focus-visible:outline-none",
          "focus-visible:border-purple-500",
          "focus-visible:ring-2 focus-visible:ring-purple-400/40",

          /* Invalid */
          "aria-invalid:border-red-400",
          "aria-invalid:ring-red-400/30",

          /* Disabled */
          "disabled:cursor-not-allowed",
          "disabled:opacity-50",
          "disabled:bg-gray-100/70",

          /* File input */
          "file:border-0",
          "file:bg-transparent",
          "file:text-sm file:font-medium",
          "file:text-purple-700",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

export { Input };
