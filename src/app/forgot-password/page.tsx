"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [debugLink, setDebugLink] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setSubmitted(true);
      if (data.debugResetLink) {
        setDebugLink(data.debugResetLink);
      }
      toast.success("Password reset instructions generated!");
    } catch {
      toast.error("Failed to process request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl space-y-6">
        <Link
          href="/login"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Login
        </Link>

        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Forgot Password?</h1>
          <p className="text-xs text-slate-500 mt-1">
            Enter your email and we&apos;ll send you instructions to reset your password.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-800">
                <p className="font-bold">Reset link dispatched</p>
                <p className="mt-1">
                  If an account exists with <strong>{email}</strong>, a secure reset link has been dispatched to your email.
                </p>
              </div>
            </div>

            {debugLink && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs space-y-1">
                <p className="font-bold text-indigo-900">Development Direct Link:</p>
                <Link href={debugLink} className="text-indigo-600 underline font-mono break-all block">
                  Click here to Reset Password
                </Link>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <span>Processing...</span> : <span>Send Reset Link</span>}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
