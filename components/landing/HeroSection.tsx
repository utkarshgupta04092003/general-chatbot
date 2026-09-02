import DemoChat from "@/components/DemoChat";
import { ButtonLink } from "@/components/ui";
import { APP_NAME } from "@/lib/config";
import { ArrowRight } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";

export function HeroSection({ session }: { session: Session | null }) {
  return (
    <section className="relative pt-28 pb-20 px-6 hero-gradient">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <Link
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-3 py-1 bg-primary-subtle border border-primary/20 rounded-sm text-xs text-primary font-medium mb-7 hover:border-primary/40 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Answers only from your own content
          </Link>

          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] mb-5 text-balance">
            Build your own AI chatbot in minutes
          </h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-pretty">
            {APP_NAME} trains a custom assistant on your own data and adds it to
            your website with one line of code.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <ButtonLink href={session ? "/dashboard" : "/signup"} size="lg" className="group">
              {session ? "Go to dashboard" : "Try it out"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </ButtonLink>
            <ButtonLink href="#how-it-works" variant="secondary" size="lg">
              How it works
            </ButtonLink>
          </div>
        </div>

        <div id="demo" className="mt-16 max-w-2xl mx-auto scroll-mt-24">
          <p className="text-xs text-muted-foreground text-center mb-3">
            Ask the demo below anything about {APP_NAME} — it answers only from
            our own docs.
          </p>
          <DemoChat />
        </div>
      </div>
    </section>
  );
}
