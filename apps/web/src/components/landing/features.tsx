"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, Target, Shield, Zap, BarChart3, Users } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Classification",
    description:
      "Gemini AI automatically categorizes and routes grievances to the right department with 95% accuracy",
  },
  {
    icon: Target,
    title: "Smart Prioritization",
    description:
      "Intelligent severity scoring considers urgency, impact, and keywords to prioritize critical issues",
  },
  {
    icon: Shield,
    title: "Duplicate Detection",
    description:
      "Advanced NLP identifies similar grievances to prevent redundancy and track collective issues",
  },
  {
    icon: Zap,
    title: "Real-Time Processing",
    description:
      "Event-driven architecture with BullMQ ensures fast, scalable processing of thousands of grievances",
  },
  {
    icon: BarChart3,
    title: "Officer Dashboards",
    description:
      "Comprehensive analytics and insights help officials track, manage, and resolve issues efficiently",
  },
  {
    icon: Users,
    title: "Multi-Language Support",
    description:
      "Automatic translation breaks language barriers, making grievances accessible to all citizens",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-gradient-to-b from-white to-purple-50/30 py-32"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute top-1/3 right-0 h-[520px] w-[520px] rounded-full bg-purple-300/20 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-20 space-y-5 text-center animate-in fade-in slide-in-from-bottom duration-700">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Powerful{" "}
            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Features
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-lg font-light leading-relaxed text-gray-600 sm:text-xl">
            Cutting-edge technology to streamline grievance management and
            empower citizens
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Card
                key={index}
                className="group relative overflow-hidden rounded-3xl border-0 bg-white/70 backdrop-blur-xl shadow-[0_20px_50px_rgba(140,120,255,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(140,120,255,0.25)] animate-in fade-in slide-in-from-bottom"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Hover gradient overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-100/0 to-blue-100/0 transition-all duration-500 group-hover:from-purple-100/50 group-hover:to-blue-100/50" />

                <CardHeader className="relative z-10 space-y-5 pt-8">
                  {/* Icon badge */}
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-200 to-blue-300 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-purple-300/50">
                    <Icon className="h-10 w-10 text-purple-700" />
                  </div>

                  <CardTitle className="text-xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-purple-700 sm:text-2xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="relative z-10 pb-8">
                  <CardDescription className="text-base font-light leading-relaxed text-gray-600 sm:text-lg">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
