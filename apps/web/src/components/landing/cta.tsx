"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export function CTA() {
    return (
        <section className="relative overflow-hidden py-32">
            {/* Background gradient wash */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-violet-500/10 to-blue-500/10 dark:from-purple-500/20 dark:via-violet-500/20 dark:to-blue-500/20" />

            {/* Glow blobs */}
            <div className="pointer-events-none absolute top-24 left-1/4 h-[520px] w-[520px] rounded-full bg-purple-300/30 dark:bg-purple-500/40 blur-[140px]" />
            <div className="pointer-events-none absolute bottom-24 right-1/4 h-[620px] w-[620px] rounded-full bg-pink-300/25 dark:bg-fuchsia-500/35 blur-[160px]" />

            <div className="relative mx-auto max-w-7xl px-6">
                <div className="mx-auto max-w-5xl">
                    {/* Glass Card */}
                    <div className="rounded-[3rem] border border-white/40 dark:border-purple-500/30 bg-white/70 dark:bg-gray-900/70 p-12 text-center shadow-[0_30px_80px_rgba(140,120,255,0.25)] dark:shadow-[0_30px_80px_rgba(140,80,255,0.6)] backdrop-blur-2xl sm:p-16 space-y-8">
                        {/* Heading */}
                        <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                            Ready to Make Your <br />
                            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                                Voice Heard?
                            </span>
                        </h2>

                        {/* Subtext */}
                        <p className="mx-auto max-w-3xl text-lg font-light leading-relaxed text-gray-600 dark:text-gray-300 sm:text-xl">
                            Join thousands of citizens already using GrievanceHub to create
                            positive change in their communities.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col items-center justify-center gap-5 pt-6 sm:flex-row">
                            <Link href="/signup">
                                <Button
                                    size="lg"
                                    className="h-16 rounded-2xl px-12 text-lg font-semibold shadow-xl shadow-purple-500/40 dark:shadow-purple-500/60 transition-all duration-300 hover:shadow-purple-500/60 dark:hover:shadow-purple-500/80 group bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500"
                                >
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>

                            <Link href="/login">
                                <Button
                                    size="lg"
                                    className="h-16 rounded-2xl px-12 text-lg font-semibold shadow-xl shadow-purple-500/40 dark:shadow-purple-500/60 transition-all duration-300 hover:shadow-purple-500/60 dark:hover:shadow-purple-500/80 group bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500"
                                >
                                    Login to Continue
                                </Button>
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap items-center justify-center gap-8 pt-10 text-purple-700 dark:text-purple-300">
                            {["100% Secure", "Free Forever", "24/7 Support"].map((text, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 text-sm font-medium sm:text-base"
                                >
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-200 to-blue-300 dark:from-purple-600 dark:to-blue-600">
                                        <Check className="h-4 w-4" />
                                    </div>
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
