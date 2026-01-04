"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp, Award } from "lucide-react";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-white via-purple-50/30 to-blue-50/20 dark:from-gray-950 dark:via-purple-950/40 dark:to-blue-950/30">
            {/* Background glow blobs */}
            <div className="pointer-events-none absolute inset-0">
                {/* Light mode blobs */}
                <div className="absolute top-24 right-1/4 h-[600px] w-[600px] rounded-full bg-purple-300/30 dark:bg-purple-500/40 blur-[160px]" />
                <div className="absolute bottom-24 left-1/3 h-[700px] w-[700px] rounded-full bg-pink-300/25 dark:bg-fuchsia-500/35 blur-[180px]" />
                <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/20 dark:bg-blue-500/30 blur-[160px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-28">
                <div className="space-y-10 text-center animate-in fade-in slide-in-from-bottom duration-1000">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/40 dark:border-purple-500/50 bg-white/70 dark:bg-purple-950/70 px-6 py-3 text-sm font-semibold text-purple-700 dark:text-purple-300 shadow-lg dark:shadow-purple-500/50 backdrop-blur-xl">
                        <Sparkles className="h-4 w-4" />
                        <span>AI-Powered Grievance Management</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl xl:text-8xl">
                        <span className="block mb-3">Your Voice,</span>
                        <span className="block bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 dark:from-purple-400 dark:via-violet-400 dark:to-blue-400 bg-clip-text font-serif italic text-transparent">
                            Our Priority
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p className="mx-auto max-w-3xl text-lg font-light leading-relaxed text-gray-600 dark:text-gray-300 sm:text-xl md:text-2xl">
                        Transform how citizens report grievances with intelligent routing,
                        AI-powered prioritization, and transparent tracking.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col items-center justify-center gap-5 pt-8 sm:flex-row">
                        <Link href="/signup">
                            <Button
                                size="lg"
                                className="group h-16 rounded-2xl px-12 text-lg font-semibold shadow-xl shadow-purple-500/40 dark:shadow-purple-500/60 transition-all duration-300 hover:shadow-purple-500/60 dark:hover:shadow-purple-500/80 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500"
                            >
                                Get Started Free
                                <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>

                        <Link href="#how-it-works">
                            <Button
                                size="lg"
                                className="group h-16 rounded-2xl px-12 text-lg font-semibold shadow-xl shadow-purple-500/40 dark:shadow-purple-500/60 transition-all duration-300 hover:shadow-purple-500/60 dark:hover:shadow-purple-500/80 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500"
                            >
                                See How It Works
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 pt-20 md:grid-cols-3">
                        {[
                            { icon: TrendingUp, value: "10K+", label: "Grievances Resolved" },
                            { icon: Award, value: "98%", label: "Satisfaction Rate" },
                            { icon: Sparkles, value: "24/7", label: "AI Support Available" },
                        ].map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={index}
                                    className="group rounded-3xl border border-white/40 dark:border-purple-500/30 bg-white/70 dark:bg-gray-900/70 p-8 shadow-[0_20px_50px_rgba(140,120,255,0.2)] dark:shadow-[0_20px_50px_rgba(140,80,255,0.5)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(140,120,255,0.3)] dark:hover:shadow-[0_30px_70px_rgba(140,80,255,0.7)] animate-in fade-in zoom-in"
                                    style={{ animationDelay: `${index * 200}ms` }}
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-200 to-blue-300 dark:from-purple-600 dark:to-blue-600 shadow-lg dark:shadow-purple-500/50">
                                            <Icon className="h-8 w-8 text-purple-700 dark:text-white" />
                                        </div>

                                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
                                            {stat.value}
                                        </div>

                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {stat.label}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom wave */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 opacity-30">
                <svg viewBox="0 0 1440 120" className="h-auto w-full text-white dark:text-gray-950">
                    <path
                        fill="currentColor"
                        d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L0,120Z"
                    />
                </svg>
            </div>
        </section>
    );
}
