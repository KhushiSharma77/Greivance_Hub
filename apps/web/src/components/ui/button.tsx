import type { VariantProps } from "class-variance-authority";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    // Base
    "inline-flex items-center justify-center whitespace-nowrap select-none",
    "text-sm font-medium",
    "transition-all duration-300 ease-out",
    "outline-none focus-visible:ring-2 focus-visible:ring-purple-400/40 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "group/button",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
    "rounded-full",
  ].join(" "),
  {
    variants: {
      variant: {
        /** 🌈 Primary – Gradient Fintech Button */
        default:
          [
            "bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600",
            "text-white",
            "shadow-lg shadow-purple-500/30",
            "hover:shadow-xl hover:shadow-purple-500/40",
            "hover:-translate-y-0.5 hover:scale-[1.02]",
            "active:scale-[0.98]",
          ].join(" "),

        /** 🧊 Outline – Clean Secondary */
        outline:
          [
            "border border-purple-200/70",
            "bg-white/70 backdrop-blur-md",
            "text-purple-700",
            "hover:bg-purple-50",
            "hover:border-purple-300",
            "hover:-translate-y-0.5",
          ].join(" "),

        /** 🌸 Secondary – Soft pastel */
        secondary:
          [
            "bg-purple-100/70 text-purple-800",
            "hover:bg-purple-200/70",
            "shadow-sm",
            "hover:-translate-y-0.5",
          ].join(" "),

        /** ✨ Ghost – Glass style */
        ghost:
          [
            "bg-transparent",
            "text-purple-700",
            "hover:bg-purple-100/60",
            "backdrop-blur-md",
          ].join(" "),

        /** 🚨 Destructive – Calm but clear */
        destructive:
          [
            "bg-red-500/10 text-red-600",
            "hover:bg-red-500/20",
            "focus-visible:ring-red-400/40",
          ].join(" "),

        /** 🔗 Link */
        link:
          [
            "text-purple-600",
            "underline-offset-4",
            "hover:underline",
          ].join(" "),
      },

      size: {
        default:
          "h-10 px-6 gap-2",

        xs:
          "h-7 px-3 text-xs gap-1 [&_svg:not([class*='size-'])]:size-3",

        sm:
          "h-8 px-4 text-sm gap-1.5 [&_svg:not([class*='size-'])]:size-3.5",

        lg:
          "h-11 px-8 text-base gap-2",

        icon:
          "h-10 w-10 p-0",

        "icon-xs":
          "h-7 w-7 p-0 [&_svg:not([class*='size-'])]:size-3",

        "icon-sm":
          "h-8 w-8 p-0",

        "icon-lg":
          "h-11 w-11 p-0",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);


function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
