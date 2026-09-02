"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { APP_NAME, RESPONSE_ERROR_MESSAGE } from "@/lib/config";
import { ENDPOINTS } from "@/lib/endpoint";
import { Bot, Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(ENDPOINTS.SIGNUP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      // Sign in after signup
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        router.push("/login");
      } else {
        router.push("/onboarding");
      }
    } catch {
      setError(RESPONSE_ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 dark:bg-primary rounded-full blur-[120px] dark:opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/20 dark:bg-primary rounded-full blur-[120px] dark:opacity-20" />
      </div>

      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground"
          >
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 shadow-e3 shadow-e2">
              <Bot className="w-7 h-7 text-foreground" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            Create an account
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Get started with {APP_NAME} today
          </p>
        </div>

        <div className="bg-card border border-border backdrop-blur-xl border border-border rounded-lg p-8 shadow-e4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-danger/10 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Smith"
                className="w-full h-10 px-3 bg-card border border-input rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@company.com"
                className="w-full h-10 px-3 bg-card border border-input rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full h-10 px-3 bg-card border border-input rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 px-4 bg-primary hover:bg-primary-hover disabled:opacity-50 text-primary-foreground font-medium rounded-md transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Free Account"
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          By signing up you agree to our{" "}
          <Link
            href="/terms"
            className="text-muted-foreground cursor-pointer hover:text-primary transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-muted-foreground cursor-pointer hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
