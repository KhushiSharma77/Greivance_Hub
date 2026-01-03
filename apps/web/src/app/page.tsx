import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Impact } from "@/components/landing/impact";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white text-gray-900 pt-16">
      {/* Background layer (NO SCROLL ISSUE) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="-top-48 -left-48 absolute h-[500px] w-[500px] rounded-full bg-purple-300/30 blur-[140px]" />
        <div className="absolute top-1/3 -right-48 h-[500px] w-[500px] rounded-full bg-blue-300/30 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-pink-300/20 blur-[140px]" />
      </div>

      {/* Content */}
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Impact />
      <CTA />
      <Footer />
    </main>
  );
}

