import { APP_NAME } from "@/lib/config";
import { ArrowRight } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";

export function CtaSection({ session }: { session: Session | null }) {
  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="relative bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/50 to-violet-700/50" />
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white rounded-full blur-[100px] opacity-10" />
          <div className="relative">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Ready to build your chatbot?
            </h2>
            <p className="text-indigo-100 text-lg mb-8">
              Join thousands of companies using {APP_NAME} to answer customer
              questions 24/7.
            </p>
            <Link
              href={session ? "/dashboard" : "/signup"}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all text-lg"
            >
              {session ? "Go to Dashboard" : "Try It Out"}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-indigo-200 text-sm mt-4">
              No credit card required · Set up in 2 minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
