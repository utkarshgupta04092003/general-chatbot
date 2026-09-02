import { CtaSection } from "@/components/landing/CtaSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { Footer } from "@/components/landing/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { auth } from "@/lib/auth";

export default async function LandingPage() {
  const session = await auth();
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar session={session} />
      <HeroSection session={session} />
      <HowItWorks />
      <FeaturesSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection session={session} />
      <Footer />
    </div>
  );
}
