import { SUPPORT_EMAIL } from "@/lib/config";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Refund Policy | App",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background text-muted-foreground py-24 px-4 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary dark:text-primary hover:text-primary dark:hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Refund Policy
        </h1>
        <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            1. Beta Phase & Paid Plans
          </h2>
          <p>
            Currently, we are in a beta testing phase and actively improving our
            product. Because of this, we do not currently have any paid plans
            available, all core features are free to use with limits, and
            therefore no refunds are applicable at this time.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            2. Future Refund Terms
          </h2>
          <p>
            Once we officially launch our paid subscriptions, we stand behind
            the quality of our product. If you are not fully satisfied, you will
            be able to request a refund within 14 days of your initial purchase,
            subject to reasonable usage constraints.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            3. How to Reach Us
          </h2>
          <p>
            If you have any feedback or questions regarding billing or our
            future pricing structure, please reach out to our team at{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-primary dark:text-primary hover:text-primary dark:hover:text-primary"
            >
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
