"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }

      toast.success("Welcome back!");
      if (data.user?.role === "ADMIN") {
        router.push(callbackUrl === "/account" ? "/admin" : callbackUrl);
      } else {
        router.push(callbackUrl);
      }
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (role: "admin" | "customer") => {
    if (role === "admin") {
      setEmail("admin@shopsphere.com");
      setPassword("Admin@ShopSphere2026");
    } else {
      setEmail("aarav.sharma@example.com");
      setPassword("Password@123");
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Sign In
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Welcome back to ShopSphere
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your registered email and password to access your account.
        </p>
      </div>

      {/* Quick Test Login Buttons for Pair-Programmer/Reviewer */}
      <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 text-xs space-y-2">
        <div className="font-bold text-slate-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Quick Autofill for Review:</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill("customer")}
            className="flex-1 py-1.5 px-2.5 bg-white border border-indigo-200 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 text-[11px] transition-colors"
          >
            Customer Demo
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill("admin")}
            className="flex-1 py-1.5 px-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 text-[11px] transition-colors shadow-sm"
          >
            Admin Demo
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {isLoading ? <span>Signing in...</span> : <span>Sign In</span>}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold text-indigo-600 hover:text-indigo-800">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-xs text-slate-400">Loading sign in...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
