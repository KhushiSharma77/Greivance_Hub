"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { ModeToggle } from "@/components/mode-toggle";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem("auth_token");
        const role = localStorage.getItem("user_role");
        setIsLoggedIn(!!token);
        setUserRole(role);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_role");
        setIsLoggedIn(false);
        setUserRole(null);
        window.location.href = "/login";
    };

    const getDashboardLink = () => {
        if (userRole === "officer") {
            return "/officer";
        } else if (userRole === "admin") {
            return "/admin";
        }
        return "/dashboard";
    };

    return (
        <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/40 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl dark:border-gray-700/40">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="group flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg transition-all group-hover:shadow-xl">
                            <span className="text-xl font-bold text-white">G</span>
                        </div>
                        <span className="hidden text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:block">
                            GrievanceHub
                        </span>
                    </Link>

                    {/* Desktop navigation */}
                    <div className="hidden items-center gap-8 md:flex">
                        {[
                            { href: "#features" as const, label: "Features" },
                            { href: "#how-it-works" as const, label: "How It Works" },
                            { href: "#impact" as const, label: "Impact" },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:text-purple-700"
                            >
                                {item.label}
                                <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTAs */}
                    <div className="hidden items-center gap-3 md:flex">
                        <ModeToggle />
                        {isLoggedIn ? (
                            <>
                                <Link href={getDashboardLink() as any}>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    onClick={handleLogout}
                                    className="flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button
                                        variant="ghost"
                                        className="text-gray-700 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400"
                                    >
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>


                    {/* Mobile menu button */}
                    <button
                        className="rounded-lg p-2 transition-colors hover:bg-purple-100/60 md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="h-6 w-6 text-gray-700" />
                        ) : (
                            <Menu className="h-6 w-6 text-gray-700" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden animate-in slide-in-from-top duration-200">
                    <div className="border-t border-white/40 bg-white/80 backdrop-blur-xl">
                        <div className="mx-auto max-w-7xl space-y-4 px-6 py-6">
                            <Link
                                href="#features"
                                className="block text-base font-medium text-gray-700 transition-colors hover:text-purple-700"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Features
                            </Link>

                            <Link
                                href="#how-it-works"
                                className="block text-base font-medium text-gray-700 transition-colors hover:text-purple-700"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                How It Works
                            </Link>

                            <Link
                                href="#impact"
                                className="block text-base font-medium text-gray-700 transition-colors hover:text-purple-700"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Impact
                            </Link>

                            <div className="flex flex-col gap-3 border-t border-white/40 pt-4">
                                {isLoggedIn ? (
                                    <>
                                        <Link href={getDashboardLink() as any} onClick={() => setIsMenuOpen(false)}>
                                            <Button variant="outline" className="w-full flex items-center gap-2">
                                                <LayoutDashboard className="w-4 h-4" />
                                                Dashboard
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            className="w-full flex items-center gap-2"
                                            onClick={() => {
                                                handleLogout();
                                                setIsMenuOpen(false);
                                            }}
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                            <Button variant="outline" className="w-full">
                                                Login
                                            </Button>
                                        </Link>
                                        <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                                            <Button className="w-full">
                                                Get Started
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
