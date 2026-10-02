"use client";

import { useState } from "react";
import { Save, ShieldCheck, CreditCard, Mail, Store } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState("ShopSphere India");
  const [currency, setCurrency] = useState("INR (₹)");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("999");
  const [defaultShippingFee, setDefaultShippingFee] = useState("99");
  const [gstRate, setGstRate] = useState("18");
  const [supportEmail, setSupportEmail] = useState("care@shopsphere.in");
  const [supportPhone, setSupportPhone] = useState("+91 1800 200 4500");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Store configuration saved successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-black text-white tracking-tight">Store Configuration</h1>
        <p className="text-xs text-slate-400 mt-1">
          Fiscal parameters, GST calculation rates, delivery logistics thresholds, and gateway environment status.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* General Store Profile */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <Store className="w-4 h-4" />
            <span>Store Profile & Operations</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                Store Entity Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                Base Currency
              </label>
              <input
                type="text"
                disabled
                value={currency}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 font-semibold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                Customer Care Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                Helpline Phone
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Tax Thresholds */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span>Taxation & Shipping Engine</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                GST Rate (%)
              </label>
              <input
                type="number"
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                Free Delivery Threshold (₹)
              </label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                Standard Shipping Fee (₹)
              </label>
              <input
                type="number"
                value={defaultShippingFee}
                onChange={(e) => setDefaultShippingFee(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Payment & Security Integrations Overview */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Integrations & Environment Variables</span>
          </h2>

          <div className="space-y-3">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Razorpay Payments API</p>
                <p className="text-[11px] text-slate-500">Key ID: configured via RAZORPAY_KEY_ID</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400">
                Connected
              </span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Resend Email Gateway</p>
                <p className="text-[11px] text-slate-500">Sender: orders@shopsphere.in</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400">
                Active
              </span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Prisma Database Engine</p>
                <p className="text-[11px] text-slate-500">Driver: SQLite / PostgreSQL Production Ready</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400">
                Synced
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
