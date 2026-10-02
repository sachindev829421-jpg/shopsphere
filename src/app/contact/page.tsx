"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Order Tracking & Inquiry",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit message");

      setSubmittedRef(data.referenceId || `TICK-${Date.now().toString().slice(-6)}`);
      toast.success("Inquiry sent successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Customer Concierge
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          How Can We Help You Today?
        </h1>
        <p className="text-sm text-slate-500">
          Have an inquiry regarding an order, artisan collaboration, or custom corporate gifting? Our dedicated team in Bengaluru is ready to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
            <div>
              <h2 className="text-xl font-bold">Contact Information</h2>
              <p className="text-xs text-slate-400 mt-1">
                Reach out to us directly through any of our official channels.
              </p>
            </div>

            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 text-indigo-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Toll-Free Helpline</div>
                  <a href="tel:+918049201888" className="font-semibold text-white hover:text-indigo-400 transition-colors">
                    +91 80 4920 1888
                  </a>
                  <p className="text-[11px] text-slate-400">Mon - Sat, 9:00 AM - 7:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 text-indigo-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Support Desk</div>
                  <a href="mailto:support@shopsphere.in" className="font-semibold text-white hover:text-indigo-400 transition-colors">
                    support@shopsphere.in
                  </a>
                  <p className="text-[11px] text-slate-400">Average response time: &lt; 2 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 text-indigo-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Corporate Office</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    ShopSphere Technologies Pvt. Ltd.<br />
                    100 Feet Road, HAL 2nd Stage, Indiranagar<br />
                    Bengaluru, Karnataka - 560038
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 text-indigo-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Central Warehouse</div>
                  <p className="text-xs text-slate-300">
                    Logistics Park, Sector 4, Bhiwandi, Maharashtra - 421302
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Verified Support
              </span>
              <span>GSTIN: 29AABCS1429B1Z2</span>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 flex items-start gap-4">
            <Sparkles className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Looking for Instant Answers?</h3>
              <p className="text-xs text-slate-600 mt-1">
                Check our Frequently Asked Questions section for immediate resolutions on tracking, refunds, and Razorpay transactions.
              </p>
              <a href="/faq" className="inline-block mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700 underline">
                Browse Help &amp; FAQs &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-sm">
          {submittedRef ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Thank You for Contacting Us</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Your request has been registered under reference ticket:{" "}
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {submittedRef}
                </span>
                . Our concierge team has been notified and will email you shortly.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setSubmittedRef(null);
                    setFormData({ name: "", email: "", phone: "", subject: "Order Tracking & Inquiry", message: "" });
                  }}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Send Us a Direct Message</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Fill out this brief form and we’ll get back to you within 24 business hours.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rahul@example.com"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Subject / Department
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  >
                    <option value="Order Tracking & Inquiry">Order Tracking &amp; Delivery</option>
                    <option value="Returns & Refunds">Returns, Exchange &amp; Refunds</option>
                    <option value="Payment & Invoicing">Payment &amp; Razorpay Issues</option>
                    <option value="Artisan Partnership">Artisan / Weaver Partnership</option>
                    <option value="Bulk Corporate Gifting">Bulk Corporate Gifting</option>
                    <option value="Other Inquiries">General Feedback</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Your Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe how we can help you with as much detail as possible (include order ID if applicable)..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  "Sending your inquiry..."
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
