"use client";

import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
