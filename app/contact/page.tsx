import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CONTACT_EMAIL, SALES_EMAIL } from "@/lib/config";

export const metadata = {
  title: "Contact Us | App",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-24 px-4 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-white mb-8">Contact Us</h1>
        <div className="space-y-6 text-lg leading-relaxed">
          <p>
            Have a question, feedback, or a partnership inquiry? We&apos;d love
            to hear from you. Use the information below to get in touch with our
            team.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-white mb-2">
                General Inquiries
              </h3>
              <p className="mb-4 text-slate-400 text-sm">
                For general questions about our product and services.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-white mb-2">Sales</h3>
              <p className="mb-4 text-slate-400 text-sm">
                Discuss Enterprise plans and custom integrations.
              </p>
              <a
                href={`mailto:${SALES_EMAIL}`}
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {SALES_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
