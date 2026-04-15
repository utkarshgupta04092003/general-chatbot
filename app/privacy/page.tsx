import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | App",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-muted-foreground py-24 px-4 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Privacy Policy
        </h1>
        <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            1. Information We Collect
          </h2>
          <p>
            When you use our services, we may collect personal information such
            as your name, email address, and authentication data via secure
            third-party providers (like Google or GitHub). We also collect data
            from the websites you connect to our system (the &quot;Data
            Sources&quot;) to generate custom embeddings.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            2. How We Use Your Information
          </h2>
          <p>
            We use the information we collect to provide, maintain, and improve
            our services, to develop new features, and to protect our company
            and our users. Your documents and chatbot data are strictly private
            and isolated; we do not use your proprietary data to publicly train
            external general-purpose AI models.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            3. Data Security
          </h2>
          <p>
            We implement high-grade security measures designed to protect your
            information from unauthorized access, alteration, disclosure, or
            destruction. We utilize industry-standard encryptions both in
            transit and at rest.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            4. Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at privacy@example.com.
          </p>
        </div>
      </div>
    </div>
  );
}
