import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        [
          /* Base */
          "relative overflow-hidden",

          /* Shape */
          "rounded-xl",

          /* Glass base */
          "bg-gradient-to-r from-purple-100/60 via-purple-200/40 to-purple-100/60",

          /* Animation */
          "animate-pulse",

          /* Subtle glow */
          "shadow-sm",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
