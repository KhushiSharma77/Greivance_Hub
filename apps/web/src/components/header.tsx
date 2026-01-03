"use client";
import Link from "next/link";

import { ModeToggle } from "./mode-toggle";

export default function Header() {
  const links = [{ to: "/", label: "Home" }] as const;

  return (
    <header className="sticky top-0 z-40">
      {/* Glass background */}
      <div className="relative">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-xl" />
        <div className="absolute inset-0 border-b border-white/40" />

        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Navigation */}
          <nav className="flex items-center gap-6">
            {links.map(({ to, label }) => {
              return (
                <Link
                  key={to}
                  href={to}
                  className="relative text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-purple-700"
                >
                  {label}
                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 hover:w-full" />
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
