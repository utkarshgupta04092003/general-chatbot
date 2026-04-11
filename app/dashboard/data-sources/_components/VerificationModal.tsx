"use client";

import {
  CheckCircle,
  Copy,
  Loader2,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

type VerificationModalProps = {
  isOpen: boolean;
  targetUrl: string;
  verificationToken: string;
  onClose: () => void;
  onVerify: () => void;
  onCopyToken: () => void;
  verifying: boolean;
  copied: boolean;
  error: string;
};

export function VerificationModal({
  isOpen,
  targetUrl,
  verificationToken,
  onClose,
  onVerify,
  onCopyToken,
  verifying,
  copied,
  error,
}: VerificationModalProps) {
  if (!isOpen) return null;

  let domain = "";
  try {
    domain = new URL(targetUrl).hostname;
  } catch (e) {
    domain = targetUrl;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Verify Ownership</h2>
          </div>
          <p className="text-slate-400 text-sm">
            To comply with safety regulations, you must verify that you own or
            are authorized to use <b>{domain}</b>.
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                1
              </span>
              Add this meta tag to your site
            </h3>
            <p className="text-xs text-slate-400 pl-7">
              Copy and paste this code into the{" "}
              <code className="text-indigo-300">{"<head>"}</code> section of
              your website&apos;s home page.
            </p>
            <div className="ml-7 flex items-center gap-2 bg-black/40 border border-white/5 rounded-xl px-4 py-3 group">
              <code className="text-xs text-indigo-300 flex-1 truncate">
                {`<meta name="chatbot-verification" content="${verificationToken || "..."}" />`}
              </code>
              <button
                onClick={onCopyToken}
                className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                2
              </span>
              Verify deployment
            </h3>
            <p className="text-xs text-slate-400 pl-7">
              Once you&apos;ve added the tag, click verify. We&apos;ll check for
              the tag on your site.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-2.5 rounded-xl text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Verification failed</p>
                <p className="opacity-80">{error}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white/2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="w-full sm:flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onVerify}
            disabled={verifying}
            className="w-full sm:flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {verifying ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            {verifying ? "Verifying..." : "Verify Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
