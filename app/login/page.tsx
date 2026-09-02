"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { APP_NAME } from "@/lib/config";
import { Bot, Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
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
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error || result.ok === false) {
        setError("Invalid email or password");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Couldn't sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex flex-col items-center gap-2 text-foreground"
          >
            <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center mx-auto mb-4">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Welcome back</h1>
            <p className="text-muted-foreground text-sm mt-2">
              Sign in to your {APP_NAME} account
            </p>
          </Link>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-e2">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-danger-subtle border border-danger/30 text-danger text-sm px-3 py-2.5 rounded-md">
                {error}
              </div>
            )}

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
                  placeholder="Your password"
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
              className="w-full h-10 px-4 bg-primary hover:bg-primary-hover disabled:opacity-50 text-primary-foreground font-medium rounded-md transition-colors flex items-center justify-center gap-2 mt-2 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
