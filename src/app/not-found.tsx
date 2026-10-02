import Link from "next/link";
import { Compass, Home, Search, ArrowRight, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">404 Error</span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Lost in the Bazaar?
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            The page you are looking for has either moved, had its link changed, or no longer exists in our catalog.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
          >
            <ShoppingBag className="w-4 h-4" /> Explore Catalog
          </Link>
        </div>

        {/* Popular destinations */}
        <div className="pt-6 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Popular Collections
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/categories/electronics-audio"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              Electronics &amp; Audio
            </Link>
            <Link
              href="/categories/womens-ethnic"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              Women&apos;s Ethnic
            </Link>
            <Link
              href="/categories/home-living"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              Home &amp; Living
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
