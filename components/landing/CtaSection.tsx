import { APP_NAME } from "@/lib/config";
import { ArrowRight } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";

export function CtaSection({ session }: { session: Session | null }) {
  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="relative bg-primary rounded-lg p-12 overflow-hidden">
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight mb-3 text-primary-foreground">
              Ready to build your chatbot?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Join thousands of companies using {APP_NAME} to answer customer
              questions 24/7.
            </p>
            <Link
              href={session ? "/dashboard" : "/signup"}
              className="inline-flex items-center gap-2 h-11 px-6 bg-card text-foreground border border-border font-medium rounded-md hover:bg-accent transition-colors text-sm"
            >
              {session ? "Go to Dashboard" : "Try It Out"}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-primary-foreground/70 text-sm mt-4">
              No credit card required · Set up in 2 minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
