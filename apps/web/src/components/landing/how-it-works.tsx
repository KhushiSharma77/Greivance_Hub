"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";

const steps = [
    {
        number: "01",
        title: "Submit Your Grievance",
        description:
            "Citizens submit complaints via web interface with text, voice, or images in any language",
    },
    {
        number: "02",
        title: "AI Analysis & Routing",
        description:
            "Gemini AI analyzes the grievance, detects language, extracts key information, and routes to the correct department",
    },
    {
        number: "03",
        title: "Smart Prioritization",
        description:
            "System assigns priority based on severity, urgency keywords, and number of affected citizens",
    },
    {
        number: "04",
        title: "Officer Processing",
        description:
            "Officials view prioritized dashboard, access AI insights, and take action on grievances",
    },
    {
        number: "05",
        title: "Transparent Tracking",
        description:
            "Citizens receive real-time updates and can track resolution progress through their dashboard",
    },
];

export function HowItWorks() {
    return (
        <section
            id="how-it-works"
            className="relative overflow-hidden bg-white dark:bg-gray-950 py-32"
        >
            {/* Background glow */}
            <div className="pointer-events-none absolute -top-24 -left-24 h-[600px] w-[600px] rounded-full bg-purple-300/20 dark:bg-purple-500/30 blur-[140px]" />

            <div className="relative mx-auto max-w-7xl px-6">
                {/* Section header */}
                <div className="mb-20 space-y-5 text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                        How It{" "}
                        <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                            Works
                        </span>
                    </h2>

                    <p className="mx-auto max-w-3xl text-lg font-light leading-relaxed text-gray-600 dark:text-gray-300 sm:text-xl">
                        A streamlined 5-step process from submission to resolution
                    </p>
                </div>

                {/* Timeline */}
                <div className="mx-auto max-w-5xl space-y-14">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="group relative flex items-start gap-8 animate-in fade-in slide-in-from-left duration-700"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            {/* Vertical connector */}
                            {index !== steps.length - 1 && (
                                <div className="absolute left-12 top-28 h-full w-px bg-gradient-to-b from-purple-300/70 dark:from-purple-500/70 to-transparent" />
                            )}

                            {/* Step number */}
                            <div className="relative z-10 flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 to-blue-600 dark:from-purple-600 dark:to-blue-600 shadow-lg dark:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-purple-500/40 dark:group-hover:shadow-purple-500/80">
                                <span className="text-3xl font-bold text-white">
                                    {step.number}
                                </span>
                            </div>

                            {/* Content card */}
                            <div className="relative flex-1 rounded-3xl border border-white/40 dark:border-purple-500/30 bg-white/70 dark:bg-gray-900/70 p-8 shadow-[0_20px_50px_rgba(140,120,255,0.18)] dark:shadow-[0_20px_50px_rgba(140,80,255,0.5)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(140,120,255,0.25)] dark:hover:shadow-[0_30px_70px_rgba(140,80,255,0.7)]">
                                <div className="mb-4 flex items-start justify-between gap-4">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-purple-700 dark:group-hover:text-purple-400 sm:text-2xl">
                                        {step.title}
                                    </h3>

                                    <CheckCircle2 className="h-7 w-7 flex-shrink-0 text-purple-500 dark:text-purple-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                </div>

                                <p className="text-base font-light leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
                                    {step.description}
                                </p>

                                <div className="mt-4 flex items-center text-purple-600 dark:text-purple-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <span className="text-sm font-medium">Learn more</span>
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
