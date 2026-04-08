import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About Us | App",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-24 px-4 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-white mb-8">About Us</h1>
        <div className="space-y-6 text-lg leading-relaxed">
          <p>
            We are dedicated to building simple, powerful tools that empower
            businesses to connect with their customers effortlessly. Our mission
            is to democratize advanced AI technology for everyone.
          </p>
          <p>
            Founded by a passionate team of engineers and product designers, we
            noticed that setting up powerful AI chatbots used to require
            extensive coding knowledge and weeks of configuration.
          </p>
          <p>
            We built this platform so anyone, regardless of technical ability,
            can use their own website content to instantly create a live AI
            assistant in minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
