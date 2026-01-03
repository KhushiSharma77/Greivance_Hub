import type { ToasterProps } from "sonner";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-600" />,
        info: <InfoIcon className="size-4 text-blue-600" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-600" />,
        error: <OctagonXIcon className="size-4 text-red-600" />,
        loading: <Loader2Icon className="size-4 animate-spin text-purple-600" />,
      }}
      style={
        {
          /* Glassmorphism tokens */
          "--normal-bg": "rgba(255, 255, 255, 0.75)",
          "--normal-text": "#1f2937", // gray-800
          "--normal-border": "rgba(147, 197, 253, 0.35)", // soft blue/purple
          "--border-radius": "14px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: [
            /* Layout */
            "flex items-start gap-3",
            "px-4 py-3",

            /* Glassmorphism */
            "backdrop-blur-xl",
            "border border-white/40",

            /* Shape & shadow */
            "rounded-xl",
            "shadow-[0_20px_40px_rgba(140,120,255,0.18)]",

            /* Typography */
            "text-sm text-gray-800",

            /* Animation polish */
            "transition-all duration-300 ease-out",
          ].join(" "),
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
