"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing password reset token");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to reset password");
        return;
      }

      setSuccess(true);
      toast.success("Password reset successfully! Please log in.");
      setTimeout(() => router.push("/login"), 2500);
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create New Password</h1>
        <p className="text-xs text-slate-500">Choose a new secure password for your ShopSphere account.</p>
      </div>

      {success ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <p className="text-xs font-bold text-emerald-900">Your password has been changed!</p>
          <p className="text-xs text-slate-500">Redirecting you to the login screen...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !token}
            className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <span>Updating...</span> : <span>Set New Password</span>}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      <div className="text-center pt-2 border-t border-slate-100">
        <Link href="/login" className="text-xs font-semibold text-slate-500 hover:text-indigo-600">
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-xs text-slate-400">Loading form...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
