import { CONTACT_EMAIL, SALES_EMAIL } from "@/lib/config";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Contact Us | App",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-muted-foreground py-24 px-4 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-foreground mb-8">Contact Us</h1>
        <div className="space-y-6 text-lg leading-relaxed">
          <p>
            Have a question, feedback, or a partnership inquiry? We&apos;d love
            to hear from you. Use the information below to get in touch with our
            team.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-card border border-border rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                General Inquiries
              </h3>
              <p className="mb-4 text-muted-foreground text-sm">
                For general questions about our product and services.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Sales
              </h3>
              <p className="mb-4 text-muted-foreground text-sm">
                Discuss Enterprise plans and custom integrations.
              </p>
              <a
                href={`mailto:${SALES_EMAIL}`}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
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
