import * as React from "react";

import { cn } from "@/lib/utils";

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        [
          // Layout
          "group/card flex flex-col gap-5",
          "overflow-hidden",

          // Glassmorphism
          "bg-white/70 backdrop-blur-xl",
          "border border-white/40",
          "shadow-[0_20px_50px_rgba(140,120,255,0.15)]",

          // Shape & spacing
          "rounded-2xl py-5 px-0",
          "text-sm/relaxed",

          // Hover polish
          "transition-all duration-300 ease-out",
          "hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(140,120,255,0.22)]",

          // Size variants
          "data-[size=sm]:gap-3",
          "data-[size=sm]:py-4",

          // Slot-aware spacing
          "has-data-[slot=card-footer]:pb-0",

          // Image handling
          "*:[img:first-child]:rounded-t-2xl",
          "*:[img:last-child]:rounded-b-2xl",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}


function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        [
          "grid auto-rows-min items-start gap-1",
          "px-6 pt-1",

          "group-data-[size=sm]/card:px-4",

          // Layout awareness
          "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
          "has-data-[slot=card-description]:grid-rows-[auto_auto]",

          // Divider polish
          "[.border-b]:pb-4",
          "group-data-[size=sm]/card:[.border-b]:pb-3",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}


function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        [
          "text-base font-semibold",
          "tracking-tight",
          "text-gray-900",
          "group-data-[size=sm]/card:text-sm",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}


function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        [
          "text-sm",
          "text-gray-600",
          "leading-relaxed",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}


function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        [
          "col-start-2 row-span-2 row-start-1",
          "self-start justify-self-end",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}


function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        [
          "px-6",
          "group-data-[size=sm]/card:px-4",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}


function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        [
          "flex items-center",
          "px-6 py-4",
          "group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:py-3",

          // Soft divider
          "border-t border-white/40",
          "bg-white/40 backdrop-blur-md",

          // Shape
          "rounded-b-2xl",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}


export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
