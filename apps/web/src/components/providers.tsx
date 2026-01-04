"use client";

import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {/* App Root */}
      <div className="relative min-h-screen bg-white text-gray-900 dark:bg-background dark:text-foreground">
        {children}

        {/* Global Toaster */}
        <Toaster richColors />
      </div>
    </ThemeProvider>
  );
}
