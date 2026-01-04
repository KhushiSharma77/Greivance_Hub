"use client";
import Link from "next/link";

import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // Don't show header on landing page (it has its own navbar)
  if (pathname === "/") {
    return null;
  }

  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/signup");

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg transition-all group-hover:shadow-xl">
            <span className="text-xl font-bold text-white">G</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            GrievanceHub
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ModeToggle />
          {isAuthPage && (
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
