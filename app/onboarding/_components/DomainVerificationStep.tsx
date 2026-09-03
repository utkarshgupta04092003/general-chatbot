"use client";

import { AlertCircle, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
// TODO: Remove these testing shortcut imports after testing
import {
  TEST_VERIFICATION_CODE,
  TEST_VERIFICATION_EMAIL,
  TEST_VERIFICATION_ENABLED,
} from "@/lib/onboarding-constants";

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
        <div className="flex items-start gap-3 bg-danger/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-md mb-6">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        {!codeRequested ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter an email address associated with this domain to receive a
              verification code.
            </p>
            {/* TODO: Remove this dummy verification email hint after testing */}
            {TEST_VERIFICATION_ENABLED && (
              <p className="text-sm text-primary italic flex flex-wrap items-center gap-1">
                For testing use
                <button
                  type="button"
                  onClick={() => setVerificationEmail(TEST_VERIFICATION_EMAIL)}
                  className="underline font-medium cursor-pointer"
                >
                  {TEST_VERIFICATION_EMAIL}
                </button>
              </p>
            )}
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
                className="flex-1 bg-card border border-border border border-border rounded-md px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-foreground"
              />
              <button
                onClick={onRequestCode}
                disabled={loading}
                className="px-6 py-3 bg-primary hover:bg-primary-hover text-white disabled:opacity-50 rounded-md font-medium transition-all cursor-pointer disabled:cursor-not-allowed"
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
            <p className="text-sm text-muted-foreground italic mb-2 text-primary flex items-center gap-2">
              Verification code sent to {verificationEmail}
              {TEST_VERIFICATION_ENABLED &&
                ` (for testing use ${TEST_VERIFICATION_CODE})`}
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
                className="flex-1 bg-card border border-border border border-border rounded-md px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-foreground"
              />
              <button
                onClick={onVerify}
                disabled={loading}
                className="px-6 py-3 bg-primary hover:bg-primary-hover disabled:opacity-50 rounded-md font-medium transition-all flex items-center gap-2 text-white cursor-pointer disabled:cursor-not-allowed"
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
              className="text-xs text-muted-foreground hover:text-primary dark:text-primary mt-2 underline cursor-pointer disabled:cursor-not-allowed"
            >
              Use different email
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 bg-card border border-border border border-border rounded-md text-sm transition-all text-foreground cursor-pointer disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>
    </div>
  );
}
