"use client";

import { PLAN_LIMITS } from "@/lib/config";

import {
  AlertCircle,
  Globe,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type UrlInputStepProps = {
  url: string;
  setUrl: (url: string) => void;
  onScan: () => void;
  loading: boolean;
  error: string | React.ReactNode;
};

export function UrlInputStep({
  url,
  setUrl,
  onScan,
  loading,
  error,
}: UrlInputStepProps) {
  return (
    <div className="animate-fade-in-up">
      <h1 className="text-3xl font-bold mb-2">Enter your website URL</h1>
      <p className="text-slate-400 mb-8">
        We&apos;ll scan your site and find all public pages to train your
        chatbot.
      </p>

      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-6">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Website URL
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-xl px-4 gap-3 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            <Globe className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onScan()}
              placeholder="https://yourwebsite.com"
              className="flex-1 py-3 bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>
          <button
            onClick={onScan}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-medium rounded-xl transition-all whitespace-nowrap"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Globe className="w-4 h-4" />
            )}
            {loading ? "Scanning..." : "Scan Website"}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          We&apos;ll discover up to {PLAN_LIMITS.FREE.MAX_PAGES} pages (free
          plan). Upgrade for unlimited page scanning.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: Globe,
            label: "Auto Discovery",
            desc: "We find all your pages",
          },
          {
            icon: Sparkles,
            label: "Smart Extraction",
            desc: "Clean text only",
          },
          {
            icon: ShieldCheck,
            label: "Privacy First",
            desc: "Public pages only",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-slate-900/50 border border-white/5 rounded-xl p-4 text-center"
          >
            <item.icon className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
            <div className="text-sm font-medium mb-1">{item.label}</div>
            <div className="text-xs text-slate-500">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
