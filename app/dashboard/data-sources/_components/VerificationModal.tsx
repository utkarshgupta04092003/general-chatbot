"use client";

import { ENDPOINTS } from "@/lib/endpoint";
import { getDomain } from "@/lib/utils";
import {
  CheckCircle,
  Loader2,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type VerificationModalProps = {
  isOpen: boolean;
  targetUrl: string;
  chatbotDomain?: string | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function VerificationModal({
  isOpen,
  targetUrl,
  chatbotDomain,
  onClose,
  onSuccess,
}: VerificationModalProps) {
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCancel = useCallback(() => {
    setStep("email");
    setEmail("");
    setCode("");
    setError("");
    onClose();
  }, [onClose]);

  function handleFinish() {
    setStep("email");
    setEmail("");
    setCode("");
    setError("");
    onSuccess();
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCancel();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleCancel]);

  if (!isOpen) return null;

  const domain = getDomain(targetUrl) || targetUrl;
  const isDifferentDomain = chatbotDomain && domain !== chatbotDomain;

  async function handleSendCode() {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(ENDPOINTS.VERIFY_DOMAIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl, action: "request-code", email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStep("code");
      } else {
        setError(data.error || "Failed to send verification code");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode() {
    if (!code.trim()) {
      setError("Please enter the verification code.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(ENDPOINTS.VERIFY_DOMAIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl, action: "verify-code", code }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStep("success");
      } else {
        setError(data.error || "Failed to verify code");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      onClick={handleCancel}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-lg w-full max-w-lg overflow-hidden shadow-e4 animate-in fade-in zoom-in duration-200"
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-md bg-primary-subtle flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary dark:text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Verify Ownership
            </h2>
          </div>
          <p className="text-muted-foreground text-sm">
            To comply with safety regulations, you must verify that you own or
            are authorized to use <b>{domain}</b>.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {isDifferentDomain && step === "email" && (
            <div className="flex items-start gap-2 bg-warning-subtle border border-yellow-500/20 text-yellow-300 px-3 py-2.5 rounded-md text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Domain Mismatch Warning</p>
                <p className="opacity-80 mt-1">
                  The URL you are adding ({domain}) is different from the
                  primary domain of this chatbot ({chatbotDomain}). You must
                  verify ownership of this new domain via an associated email
                  address.
                </p>
              </div>
            </div>
          )}

          {step === "email" && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">
                Enter your domain email
              </label>
              <p className="text-xs text-muted-foreground">
                Please provide an email address suffix with{" "}
                <code className="text-primary">@{domain}</code> to receive a
                6-digit OTP.
              </p>
              <input
                type="email"
                placeholder={`e.g., admin@${domain}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-muted border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          )}

          {step === "code" && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">
                Enter Verification Code
              </label>
              <p className="text-xs text-muted-foreground">
                We sent a 6-digit code to{" "}
                <span className="text-foreground font-medium">{email}</span>.
              </p>
              <input
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="w-full bg-muted border border-border rounded-md px-4 py-3 text-sm tracking-[0.5em] text-center text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
              <div className="w-12 h-12 bg-success/10 flex items-center justify-center rounded-full mb-2">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <p className="font-semibold text-success">Domain Verified!</p>
              <p className="text-sm text-muted-foreground">
                You can now add {domain} to your chatbot.
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 bg-danger/10 border border-red-500/20 text-red-300 px-3 py-2.5 rounded-md text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Error</p>
                <p className="opacity-80">{error}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white/2 flex flex-col sm:flex-row gap-3">
          {step !== "success" && (
            <button
              onClick={handleCancel}
              className="w-full sm:flex-1 py-2.5 bg-card border border-border hover:bg-accent/50 text-foreground text-sm font-medium rounded-md transition-all cursor-pointer"
            >
              Cancel
            </button>
          )}

          {step === "email" && (
            <button
              onClick={handleSendCode}
              disabled={loading || !email.trim()}
              className="w-full sm:flex-1 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              {loading ? "Sending..." : "Send Code"}
            </button>
          )}

          {step === "code" && (
            <button
              onClick={handleVerifyCode}
              disabled={loading || code.length !== 6}
              className="w-full sm:flex-1 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              {loading ? "Verifying..." : "Verify"}
            </button>
          )}

          {step === "success" && (
            <button
              onClick={handleFinish}
              className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-md transition-all cursor-pointer"
            >
              Continue Adding URL
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
