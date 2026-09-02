import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | App",
};

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Usage rules
          </h2>
          <p>
            By using our services, you agree not to use the platform for any
            illegal or unauthorized purpose. You are solely responsible for your
            conduct and any data, text, information, usernames, graphics,
            photos, links, or other material that you submit, post, or display
            on or via the platform. You must not violate any laws in your
            jurisdiction, including but not limited to copyright laws.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Liability
          </h2>
          <p>
            We are not liable for any direct, indirect, incidental, special, or
            consequential damages or losses related to your use of the services.
            The service and all materials included therein are provided on an
            &quot;as is&quot; and &quot;as available&quot; basis without any
            warranty of any kind, either express or implied.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
            Limits
          </h2>
          <p>
            Usage and service limits are strictly enforced based on your active
            subscription plan. This includes maximum page crawling limits,
            vector storage limits, and monthly chat message quotas. We reserve
            the right to throttle, pause, or suspend any accounts that
            excessively bypass, abuse, or exceed these stated limits to ensure
            platform stability for all users.
          </p>
        </div>
      </div>
    </div>
  );
}
