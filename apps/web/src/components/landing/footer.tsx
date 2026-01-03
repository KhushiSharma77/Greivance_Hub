"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/40 bg-white/70 backdrop-blur-xl">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/3 h-[420px] w-[420px] rounded-full bg-purple-300/20 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg">
                <span className="text-2xl font-bold text-white">G</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-gray-900">
                GrievanceHub
              </span>
            </div>

            <p className="text-base font-light leading-relaxed text-gray-600">
              Empowering citizens to create positive change through intelligent
              grievance management.
            </p>

            <div className="flex items-center gap-4">
              {[Twitter, Github, Linkedin, Mail].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="group flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100/70 transition-all hover:-translate-y-0.5 hover:bg-gradient-to-br hover:from-purple-500 hover:to-blue-600 hover:shadow-lg"
                >
                  <Icon className="h-5 w-5 text-purple-700 transition-colors group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              Product
            </h3>
            <ul className="space-y-4">
              {["Features", "How It Works", "Impact", "Get Started"].map(
                (item, index) => (
                  <li key={index}>
                    <Link
                      href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                      className="text-base font-light text-gray-600 transition-colors hover:text-purple-700"
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              Support
            </h3>
            <ul className="space-y-4">
              {["Help Center", "Documentation", "Contact Us", "FAQs"].map(
                (item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-base font-light text-gray-600 transition-colors hover:text-purple-700"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              Legal
            </h3>
            <ul className="space-y-4">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
                "Disclaimer",
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-base font-light text-gray-600 transition-colors hover:text-purple-700"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/40 pt-8 text-base text-gray-600 sm:flex-row">
          <p className="font-light">
            © 2026 GrievanceHub by Team Call of Code. All rights reserved.
          </p>
          <p className="font-light">
            Built for{" "}
            <span className="font-medium text-purple-700">
              ByteQuest 2025
            </span>{" "}
            Hackathon
          </p>
        </div>
      </div>
    </footer>
  );
}
