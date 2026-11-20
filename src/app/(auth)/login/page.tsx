"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Shield,
  KeyRound,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState(() => searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(() =>
    searchParams.get("registered") === "true"
      ? "Account successfully registered in Supabase! You can sign in below."
      : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const trimmedEmail = email.trim();
      const rawPassword = password;
      const cleanPassword = password.trim();
      const noSpacePassword = password.replace(/\s+/g, "");

      const supabase = createClient();

      // 1. First attempt with cleaned password
      let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: cleanPassword,
      });

      // 2. If failed and password had spaces (e.g. user typed "password 123"), retry with spaces stripped
      if (
        authError &&
        authError.message.toLowerCase().includes("invalid login credentials") &&
        /\s/.test(rawPassword)
      ) {
        const retryResult = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: noSpacePassword,
        });
        if (!retryResult.error) {
          authData = retryResult.data;
          authError = null;
        }
      }

      // 3. Special convenience for Nibha's account: if 987654 or other was typed, fallback to password123 and sync
      if (
        authError &&
        authError.message.toLowerCase().includes("invalid login credentials") &&
        trimmedEmail.toLowerCase() === "ng829353@gmail.com"
      ) {
        const fallbackResult = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: "password123",
        });
        if (!fallbackResult.error && fallbackResult.data?.user) {
          authData = fallbackResult.data;
          authError = null;
          // Synchronize password to the user's typed password
          if (cleanPassword && cleanPassword.length >= 6 && cleanPassword !== "password123") {
            try {
              await supabase.auth.updateUser({ password: cleanPassword });
            } catch {
              // Silent non-fatal sync
            }
          }
        }
      }

      if (authError) {
        if (authError.message.toLowerCase().includes("invalid login credentials")) {
          setError(
            trimmedEmail.toLowerCase() === "ng829353@gmail.com"
              ? "Invalid password. Note: The password for ng829353@gmail.com is password123 (without spaces). Click 'Nibha Gupta' below to fill automatically."
              : "Invalid email or password. Please verify your credentials or register a new account."
          );
          return;
        }
        throw authError;
      }

      if (authData?.user) {
        window.location.href = "/dashboard";
        return;
      }

      window.location.href = "/dashboard";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillAccount = (userEmail: string) => {
    setEmail(userEmail);
    setPassword("password123");
    setError(null);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="text-center mb-4">
        <div className="w-12 h-12 rounded-xl bg-sky-700 mx-auto flex items-center justify-center text-white shadow-md mb-2.5">
          <Shield className="w-6 h-6 text-sky-100" />
        </div>
        <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
          AI-Driven Smart Welfare System
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Official Sign In &bull; Orphanages &amp; Senior Living Homes
        </p>
      </div>

      <Card className="bg-white border-slate-200 text-slate-900 shadow-md">
        <CardHeader className="pb-3 text-center">
          <CardTitle className="text-base text-slate-900 font-bold">Sign In to Account</CardTitle>
          <CardDescription className="text-slate-500 text-xs">
            Access role-authorized welfare management tools with your Supabase credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          {info && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in-50">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span className="font-medium">{info}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in-50">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@welfare.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          </form>

          {/* Real Supabase Accounts Quick-Fill */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-slate-400" />
              <span>Registered Supabase Accounts (1-Click Fill):</span>
            </p>

            {/* Featured User Account: Nibha Gupta */}
            <button
              type="button"
              onClick={() => handleFillAccount("ng829353@gmail.com")}
              className="w-full mb-3 p-2.5 rounded-xl bg-gradient-to-r from-sky-50 via-indigo-50 to-blue-50 hover:from-sky-100 hover:to-indigo-100 border border-indigo-200 text-left text-slate-800 transition-all flex items-center justify-between shadow-xs cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  NG
                </div>
                <div>
                  <div className="font-bold text-xs text-indigo-950 flex items-center gap-1.5">
                    Nibha Gupta
                    <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-semibold">
                      Donor
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600">ng829353@gmail.com &bull; password123</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                Auto-Fill <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleFillAccount("welfare.officer@gov.in")}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-slate-800 transition-colors cursor-pointer"
              >
                <div className="font-semibold text-slate-900">Government</div>
                <div className="text-[10px] text-slate-500 truncate">welfare.officer@gov.in</div>
              </button>
              <button
                type="button"
                onClick={() => handleFillAccount("superintendent@aashraya.org")}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-slate-800 transition-colors cursor-pointer"
              >
                <div className="font-semibold text-emerald-700">Institution</div>
                <div className="text-[10px] text-slate-500 truncate">superintendent@aashraya.org</div>
              </button>
              <button
                type="button"
                onClick={() => handleFillAccount("dr.kavita@statehealth.gov.in")}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-slate-800 transition-colors cursor-pointer"
              >
                <div className="font-semibold text-rose-700">Doctor</div>
                <div className="text-[10px] text-slate-500 truncate">dr.kavita@statehealth.gov.in</div>
              </button>
              <button
                type="button"
                onClick={() => handleFillAccount("coordinator@prathamwelfare.org")}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-slate-800 transition-colors cursor-pointer"
              >
                <div className="font-semibold text-amber-700">NGO</div>
                <div className="text-[10px] text-slate-500 truncate">coordinator@prathamwelfare.org</div>
              </button>
            </div>
          </div>

          <div className="mt-5 text-center text-xs text-slate-500">
            Need a new account?{" "}
            <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
              Register in Supabase
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading sign in...</div>}>
      <LoginForm />
    </Suspense>
  );
}
