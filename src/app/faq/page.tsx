"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Search, Truck, CreditCard, RefreshCw, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  q: string;
  a: string;
  category: "orders" | "shipping" | "returns" | "authenticity";
}

const FAQS: FAQItem[] = [
  {
    category: "orders",
    q: "What payment methods are supported on ShopSphere?",
    a: "We support all major payment modes via Razorpay including UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit cards (Visa, MasterCard, RuPay, Amex), Net Banking across 50+ Indian banks, and Cash on Delivery (COD) for orders up to ₹10,000.",
  },
  {
    category: "orders",
    q: "How do I apply a discount coupon?",
    a: "During the checkout process or on the Cart page, enter your coupon code (e.g. WELCOME10, FESTIVE25, or FLAT500) into the Coupon Code field and click 'Apply'. The discounted amount will instantly reflect in your order summary if eligibility conditions are met.",
  },
  {
    category: "orders",
    q: "Can I modify or cancel my order after placing it?",
    a: "You can cancel your order directly from your Account Orders dashboard as long as the status is 'Pending' or 'Confirmed'. Once an order transitions to 'Shipped' or 'Out for Delivery', cancellations cannot be processed automatically, but you may refuse delivery or request an easy return.",
  },
  {
    category: "shipping",
    q: "How long does standard delivery take across India?",
    a: "Orders in Tier-1 metros (Bengaluru, Mumbai, Delhi-NCR, Hyderabad, Chennai, Kolkata) are typically delivered within 2 to 4 business days. For Tier-2/Tier-3 cities and regional locations, delivery typically takes 4 to 7 business days via our premium courier partners (BlueDart, Delhivery, Xpressbees).",
  },
  {
    category: "shipping",
    q: "Is shipping free?",
    a: "Yes! ShopSphere provides completely free standard shipping on all prepaid and COD orders with an aggregate cart value of ₹999 or above. Orders below ₹999 incur a nominal flat standard shipping fee of ₹99.",
  },
  {
    category: "shipping",
    q: "How do I track my shipment in real time?",
    a: "Once your package is dispatched from our central fulfillment hub, you will receive an SMS and email notification with an AWB tracking number. You can also view the live order timeline under your Account &rarr; Orders dashboard.",
  },
  {
    category: "returns",
    q: "What is ShopSphere's return and replacement policy?",
    a: "We offer a 7-day hassle-free return and replacement guarantee from the date of delivery on eligible apparel, electronics, and home decor items. Products must be unused, in original condition with intact brand tags, certificates, and packaging.",
  },
  {
    category: "returns",
    q: "How does the reverse pickup work?",
    a: "Upon initiating a return request, our logistics partner will schedule a doorstep reverse pickup within 48-72 hours. Once inspected and verified at our hub, your refund will be disbursed back to your original payment method (or bank account for COD) within 3-5 business days.",
  },
  {
    category: "authenticity",
    q: "Are the handlooms and sarees Silk Mark certified?",
    a: "Yes, 100%. All handloom sarees, including our Varanasi Katan silks and Chanderi drapes, are procured directly from certified master weaver cooperatives and carry government-recognized Silk Mark authentication.",
  },
  {
    category: "authenticity",
    q: "How do I verify the purity of your Ayurvedic cookware & copper vessels?",
    a: "Our copper dispensers and drinkware are handcrafted from certified 99.7% pure virgin copper, tested for food-grade safety without any harmful lead solder or synthetic inner coatings.",
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesQuery =
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Help &amp; Documentation
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-500">
          Everything you need to know about placing orders, Razorpay transactions, shipping timelines, and returns.
        </p>

        {/* Search */}
        <div className="relative max-w-md mx-auto pt-4">
          <Search className="w-4 h-4 absolute left-3.5 top-7 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions (e.g., returns, UPI, delivery)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeCategory === "all"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          All Topics
        </button>
        <button
          onClick={() => setActiveCategory("orders")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeCategory === "orders"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" /> Payments &amp; Orders
        </button>
        <button
          onClick={() => setActiveCategory("shipping")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeCategory === "shipping"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Truck className="w-3.5 h-3.5" /> Shipping &amp; Logistics
        </button>
        <button
          onClick={() => setActiveCategory("returns")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeCategory === "returns"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" /> Returns &amp; Refunds
        </button>
        <button
          onClick={() => setActiveCategory("authenticity")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeCategory === "authenticity"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Purity &amp; Authenticity
        </button>
      </div>

      {/* Accordion List */}
      <div className="space-y-3 max-w-3xl mx-auto">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No questions matched your search.</p>
            <p className="text-xs text-slate-400 mt-1">Try searching with a different term or browse our categories.</p>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <span className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-indigo-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still need help callout */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <h3 className="text-lg font-bold">Have an unresolved question?</h3>
          <p className="text-xs text-slate-400 mt-1">
            Our customer concierge team is available 6 days a week to support you.
          </p>
        </div>
        <Link
          href="/contact"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap shadow-md shadow-indigo-600/20"
        >
          Contact Support Desk
        </Link>
      </div>
    </div>
  );
}
