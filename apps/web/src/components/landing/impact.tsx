"use client";

import { TrendingUp, Users, Clock, Award } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Active Citizens",
    description: "Registered users across India",
  },
  {
    icon: TrendingUp,
    value: "15,000+",
    label: "Grievances Resolved",
    description: "Issues successfully addressed",
  },
  {
    icon: Clock,
    value: "48hrs",
    label: "Average Resolution",
    description: "Faster than traditional systems",
  },
  {
    icon: Award,
    value: "98%",
    label: "Satisfaction Rate",
    description: "Citizens satisfied with outcomes",
  },
];

export function Impact() {
  return (
    <section
      id="impact"
      className="relative overflow-hidden bg-gradient-to-b from-white to-purple-50/30 py-32"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute bottom-0 right-0 h-[720px] w-[720px] rounded-full bg-purple-300/20 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-20 space-y-5 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Real Impact, Real{" "}
            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Results
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-lg font-light leading-relaxed text-gray-600 sm:text-xl">
            Transforming citizen-government communication across India
          </p>
        </div>

        {/* Stats grid */}
        <div className="mb-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={index}
                className="group rounded-3xl border border-white/40 bg-white/70 p-10 text-center shadow-[0_20px_50px_rgba(140,120,255,0.18)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(140,120,255,0.25)] animate-in fade-in zoom-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-200 to-blue-300 shadow-lg transition-all duration-300 group-hover:scale-110">
                  <Icon className="h-10 w-10 text-purple-700" />
                </div>

                <div className="mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl">
                  {stat.value}
                </div>

                <div className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl">
                  {stat.label}
                </div>

                <div className="text-base font-light text-gray-600">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recognition badge */}
        <div className="text-center">
          <div className="inline-block rounded-3xl border border-white/40 bg-white/70 p-1 shadow-[0_20px_50px_rgba(140,120,255,0.2)] backdrop-blur-xl">
            <div className="rounded-3xl px-10 py-6">
              <p className="text-xl font-semibold text-gray-900 sm:text-2xl">
                Recognized as a{" "}
                <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  Top Innovation
                </span>{" "}
                in GovTech Solutions
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
