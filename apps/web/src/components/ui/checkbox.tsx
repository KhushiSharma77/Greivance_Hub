import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        [
          // Base layout
          "relative shrink-0",
          "flex items-center justify-center",
          "size-4",

          // Shape
          "rounded-md",

          // Glass base
          "bg-white/70 backdrop-blur-sm",
          "border border-purple-200/60",

          // Checked state
          "data-checked:bg-gradient-to-br data-checked:from-violet-600 data-checked:to-blue-600",
          "data-checked:border-transparent",
          "data-checked:text-white",
          "shadow-sm",

          // Hover & focus
          "transition-all duration-200 ease-out",
          "hover:border-purple-300",
          "focus-visible:ring-2 focus-visible:ring-purple-400/40",
          "focus-visible:ring-offset-2",

          // Invalid
          "aria-invalid:border-red-400",
          "aria-invalid:ring-red-400/30",

          // Disabled
          "disabled:cursor-not-allowed disabled:opacity-50",
          "group-has-disabled/field:opacity-50",

          // Click target expansion
          "after:absolute after:-inset-x-3 after:-inset-y-2",

        ].join(" "),
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={cn(
          [
            "grid place-content-center",
            "text-current",

            // Check animation
            "transition-transform duration-200 ease-out",
            "data-checked:scale-100 scale-90",

            "[&>svg]:size-3.5",
          ].join(" "),
        )}
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}


export { Checkbox };
