"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RotateCcw, Home, LifeBuoy } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors
    console.error("Global Application Error caught in boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <AlertOctagon className="w-10 h-10 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-600">Something went wrong</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Unexpected System Hiccup
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            We encountered an unexpected issue while loading this page. Our technical team has been notified.
          </p>
          {error.digest && (
            <p className="text-[11px] font-mono text-slate-400 bg-slate-100 py-1 px-2 rounded max-w-xs mx-auto">
              Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Home className="w-4 h-4" /> Go to Homepage
          </Link>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
          <LifeBuoy className="w-4 h-4" />
          <span>Need urgent help? <Link href="/contact" className="text-indigo-600 underline font-semibold">Contact Concierge</Link></span>
        </div>
      </div>
    </div>
  );
}
