import { SUPPORT_EMAIL } from "@/lib/config";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Support | App",
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-24 px-4 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-white mb-8">Support</h1>
        <div className="space-y-6 text-lg leading-relaxed">
          <p>
            We are here to help you get the most out of our platform. If you
            have any questions or need assistance, please feel free to reach out
            to our dedicated support team.
          </p>
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Contact Support
            </h2>
            <p className="mb-4">
              Email us at:{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {SUPPORT_EMAIL}
              </a>
            </p>
            <p>
              Our support hours are Monday through Friday, 9am - 5pm IST. We
              typically respond to all inquiries within 24-48 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
