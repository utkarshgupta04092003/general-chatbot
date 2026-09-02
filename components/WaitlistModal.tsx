"use client";

import { createEnquiry } from "@/app/actions/enquiry";
import { MOBILE_PLACEHOLDER } from "@/lib/config";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  Send,
  X,
} from "lucide-react";
import { useState } from "react";

type WaitlistModalProps = {
  plan: string;
  isOpen: boolean;
  onClose: () => void;
};

export function WaitlistModal({ plan, isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const result = await createEnquiry(email, plan, description, mobile);
      if (result.success) {
        setStatus("success");
        setTimeout(() => {
          onClose();
          setStatus("idle");
          setEmail("");
          setMobile("");
          setDescription("");
        }, 3000);
      } else {
        setStatus("error");
        setError(result.error || "Failed to submit enquiry");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm animate-in fade-in duration-300 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-card border border-border rounded-lg shadow-e4 p-6 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Join the waitlist
              </h2>
              <p className="text-xs text-muted-foreground">
                Enquiring for {plan} Plan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-card border border-border rounded-lg transition-colors text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {status === "success" ? (
          <div className="py-8 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              We&apos;ve got you!
            </h3>
            <p className="text-muted-foreground text-sm">
              Thanks for your interest. We&apos;ll reach out to {email} as soon
              as the {plan} plan is ready.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-card border border-border border border-border rounded-md pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder={MOBILE_PLACEHOLDER}
                  className="w-full bg-card border border-border border border-border rounded-md pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                Tell us about your needs (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="How many chatbots do you need? Any custom requirements?"
                rows={4}
                className="w-full bg-card border border-border border border-border rounded-md px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
              />
            </div>

            {status === "error" && (
              <div className="flex items-start gap-3 bg-danger/10 border border-red-500/20 rounded-md p-3 text-danger">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-semibold rounded-md transition-all shadow-e2 shadow-e2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              )}
              {loading ? "Submitting..." : "Submit Enquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
