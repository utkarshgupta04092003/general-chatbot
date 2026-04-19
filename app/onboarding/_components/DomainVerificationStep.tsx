"use client";

import { AlertCircle, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";

type DomainVerificationStepProps = {
  url: string;
  verificationEmail: string;
  setVerificationEmail: (email: string) => void;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  codeRequested: boolean;
  setCodeRequested: (requested: boolean) => void;
  onRequestCode: () => void;
  onVerify: () => void;
  onBack: () => void;
  loading: boolean;
  error: string | React.ReactNode;
};

export function DomainVerificationStep({
  url,
  verificationEmail,
  setVerificationEmail,
  verificationCode,
  setVerificationCode,
  codeRequested,
  setCodeRequested,
  onRequestCode,
  onVerify,
  onBack,
  loading,
  error,
}: DomainVerificationStepProps) {
  const domain = url
    .trim()
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .replace(/^www\./, "");

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-3xl font-bold mb-2">Verify your domain</h1>
      <p className="text-muted-foreground mb-8">
        For security, please verify ownership of <b>{domain}</b>.
      </p>

      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-6">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        {!codeRequested ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter an email address associated with this domain to receive a
              verification code.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                value={verificationEmail}
                onChange={(e) => setVerificationEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    e.preventDefault();
                    onRequestCode();
                  }
                }}
                placeholder={`admin@${domain}`}
                className="flex-1 hover:bg-accent/50 bg-muted/30 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-foreground"
              />
              <button
                onClick={onRequestCode}
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 rounded-xl font-medium transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Send Code"
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground italic mb-2 text-indigo-300 flex items-center gap-2">
              Verification code sent to {verificationEmail}
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    e.preventDefault();
                    onVerify();
                  }
                }}
                placeholder="Enter 6-digit code"
                className="flex-1 hover:bg-accent/50 bg-muted/30 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-foreground"
              />
              <button
                onClick={onVerify}
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl font-medium transition-all flex items-center gap-2 text-white cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>
            </div>
            <button
              onClick={() => setCodeRequested(false)}
              className="text-xs text-muted-foreground hover:text-indigo-600 dark:text-indigo-400 mt-2 underline cursor-pointer disabled:cursor-not-allowed"
            >
              Use different email
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 hover:bg-accent/50 bg-muted/30 border border-border rounded-xl text-sm transition-all text-foreground cursor-pointer disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>
    </div>
  );
}
