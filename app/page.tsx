import { PricingSection } from "@/components/PricingSection";
import { auth } from "@/lib/auth";

import { CtaSection } from "@/components/landing/CtaSection";
import { DemoSection } from "@/components/landing/DemoSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { Footer } from "@/components/landing/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import { SocialProof } from "@/components/landing/SocialProof";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";

export default async function LandingPage() {
  const session = await auth();
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar session={session} />
      <HeroSection session={session} />
      <SocialProof />
      <HowItWorks />
      <FeaturesSection />
      <DemoSection />

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-card/30">
        <div className="max-w-[70rem] mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-300 font-medium mb-4">
              Simple Plans
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Start free, scale as you grow
            </h2>
            <p className="text-muted-foreground text-lg">
              No credit card required to get started.
            </p>
          </div>

          <PricingSection session={session} />
        </div>
      </section>

      <TestimonialsSection />
      <FaqSection />
      <CtaSection session={session} />
      <Footer />
    </div>
  );
}
