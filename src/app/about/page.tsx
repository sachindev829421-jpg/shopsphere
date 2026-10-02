import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, Heart, Award, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About Us | ShopSphere India",
  description: "Learn about the mission, artisanal craft partnerships, and philosophy powering ShopSphere India.",
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          The ShopSphere Story
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Bridging Timeless Indian Heritage with Everyday Living
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Founded in 2026, ShopSphere was born out of a desire to create a modern Indian department store
          where authentic handlooms, Ayurvedic wellness, artisanal cookware, and high-precision electronics coexist harmoniously.
        </p>
      </div>

      {/* Visual Banner */}
      <div className="aspect-[21/9] relative rounded-3xl overflow-hidden shadow-xl border border-slate-200">
        <Image
          src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1400&q=80"
          alt="Weavers at work in Varanasi"
          fill
          className="object-cover"
        />
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Uncompromising Authenticity</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every Banarasi drape comes silk mark certified. Every copper vessel is pure 99.7% copper. We work directly with certified craft clusters.
          </p>
        </div>

        <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Fair Trade & Direct Sourcing</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            By eliminating traditional middleman chains, we provide artisans in Uttar Pradesh, Rajasthan, and Karnataka fair compensation.
          </p>
        </div>

        <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Customer Obsession</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Seamless Razorpay payments, nationwide cash on delivery, 7-day hassle-free doorstep returns, and round-the-clock Indian customer support.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 sm:p-12 bg-slate-900 text-white rounded-3xl text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold">Experience the ShopSphere Difference</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Explore our collection of over 30+ artisan and technology essentials delivered to your doorstep.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
