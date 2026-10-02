"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle2, ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Value Proposition Highlights */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Free Express Shipping</h4>
                <p className="text-xs text-slate-400 mt-0.5">On all orders across India above ₹999</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">100% Genuine Products</h4>
                <p className="text-xs text-slate-400 mt-0.5">Directly sourced verified Indian artisans</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Hassle-Free Returns</h4>
                <p className="text-xs text-slate-400 mt-0.5">7-day doorstep replacement guarantee</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">24/7 Dedicated Support</h4>
                <p className="text-xs text-slate-400 mt-0.5">Prompt WhatsApp & email assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center">
                <span className="text-white font-black text-xl">S</span>
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Shop<span className="text-indigo-400">Sphere</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              ShopSphere is India&apos;s curated online department store celebrating authentic craftsmanship,
              modern electronics, festive attire, and mindful living. Crafted for discerning Indian households.
            </p>
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Secure Payments Powered By</p>
              <div className="flex items-center gap-3 mt-3 flex-wrap text-xs text-slate-400 font-medium">
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">Razorpay</span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">UPI</span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">RuPay</span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">Visa / MC</span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800">Cash on Delivery</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4 tracking-wide uppercase">Shop Collections</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/categories/electronics-audio" className="hover:text-indigo-400 transition-colors">
                  Electronics & Audio
                </Link>
              </li>
              <li>
                <Link href="/categories/mens-fashion" className="hover:text-indigo-400 transition-colors">
                  Men&apos;s Fashion
                </Link>
              </li>
              <li>
                <Link href="/categories/womens-fashion" className="hover:text-indigo-400 transition-colors">
                  Women&apos;s Ethnic
                </Link>
              </li>
              <li>
                <Link href="/categories/home-living" className="hover:text-indigo-400 transition-colors">
                  Home & Living
                </Link>
              </li>
              <li>
                <Link href="/categories/beauty-wellness" className="hover:text-indigo-400 transition-colors">
                  Beauty & Wellness
                </Link>
              </li>
              <li>
                <Link href="/categories/footwear-accessories" className="hover:text-indigo-400 transition-colors">
                  Footwear & Watches
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4 tracking-wide uppercase">Support & Policies</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-indigo-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-indigo-400 transition-colors">
                  FAQ & Help Center
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-indigo-400 transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-indigo-400 transition-colors">
                  Refund & Return Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-indigo-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4 tracking-wide uppercase">Join the Circle</h4>
            <p className="text-sm text-slate-400 mb-4">
              Subscribe to get exclusive festival promotions, early sale access, and member vouchers.
            </p>
            {subscribed ? (
              <div className="flex items-center space-x-2 text-emerald-400 text-sm font-medium p-3 bg-emerald-950/50 rounded-xl border border-emerald-800">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Thank you! Check your inbox for WELCOME10 code.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ShopSphere India Private Limited. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Designed with passion for modern Indian commerce.</p>
        </div>
      </div>
    </footer>
  );
}
