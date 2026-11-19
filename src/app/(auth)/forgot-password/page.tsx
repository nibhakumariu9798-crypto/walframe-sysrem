"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  KeyRound,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Email format validation in real time
  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const emailTouched = email.length > 0;
  const isEmailValid = isValidEmail(email);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your registered email address.");
      return;
    }

    if (!isEmailValid) {
      setError("Please enter a valid email format (e.g. name@domain.com).");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const origin =
        typeof window !== "undefined" && window.location.origin
          ? window.location.origin
          : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: `${origin}/reset-password`,
      });

      if (resetError) {
        if (
          resetError.message.toLowerCase().includes("rate limit") ||
          resetError.status === 429
        ) {
          setError("Rate limit reached. Please wait a minute before requesting another link.");
        } else if (
          resetError.message.toLowerCase().includes("invalid") ||
          resetError.message.toLowerCase().includes("domain")
        ) {
          setError(
            "Supabase mailer could not verify this email domain. Please ensure you enter a valid, deliverable email address."
          );
        } else {
          setError(resetError.message);
        }
        return;
      }

      setSuccess(true);
      setCooldown(60);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send password reset link.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || !email) return;
    await handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white border-slate-200 text-slate-900 shadow-md">
        <CardHeader className="pb-3 text-center">
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
            <KeyRound className="w-5 h-5" />
          </div>
          <CardTitle className="text-base text-slate-900 font-bold">
            Reset Portal Password
          </CardTitle>
          <CardDescription className="text-slate-500 text-xs">
            Enter your account email to receive a secure recovery link
          </CardDescription>
        </CardHeader>

        <CardContent>
          {success ? (
            <div className="p-4 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-in zoom-in-75 duration-300">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="font-semibold text-slate-900 text-sm">
                  Recovery Email Dispatched!
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  We have sent a secure password reset link to:
                </p>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-semibold text-indigo-700 break-all my-2">
                  {email}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Please click the link inside your email inbox to choose a new password. If you don&apos;t see it within a couple of minutes, check your spam or junk folder.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResend}
                  disabled={cooldown > 0 || loading}
                  className="w-full text-xs font-semibold py-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
                  {cooldown > 0 ? `Resend Link (${cooldown}s)` : "Resend Recovery Email"}
                </Button>

                <Link href="/login" className="w-full">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2">
                    <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in-50">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 mt-0.5" />
                  <div className="flex-1 leading-relaxed">{error}</div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-slate-700 font-semibold block">
                  Registered Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="e.g. yourname@domain.com"
                    className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 font-medium transition-all ${
                      emailTouched && !isEmailValid
                        ? "border-amber-300 focus:ring-amber-500"
                        : "border-slate-200 focus:ring-indigo-500"
                    }`}
                  />
                </div>
                {emailTouched && !isEmailValid && (
                  <p className="text-[11px] text-amber-600 font-medium">
                    Please provide a valid email format (e.g. name@mail.com)
                  </p>
                )}
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span>
                  Supabase Auth will issue a cryptographically signed recovery token that expires in 1 hour.
                </span>
              </div>

              <Button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-sm"
                disabled={loading || (emailTouched && !isEmailValid)}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Sending Reset Link to Supabase...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    Send Password Reset Link
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Return to Sign In
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
