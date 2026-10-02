import Link from "next/link";
import { FileText, CheckCircle, AlertTriangle, Scale, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Terms of Service | ShopSphere India",
  description: "Terms and conditions governing the use of ShopSphere platform, order placement, and customer rights.",
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="space-y-3 border-b border-slate-200 pb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Legal Agreement
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Terms of Service &amp; Conditions of Use
        </h1>
        <p className="text-xs text-slate-500">
          Last Updated: October 2026 &bull; By accessing or purchasing from ShopSphere, you agree to be bound by these terms.
        </p>
      </div>

      <div className="prose prose-slate max-w-none space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" /> 1. Platform Overview
          </h2>
          <p>
            These Terms govern your use of the website and services provided by ShopSphere Technologies Pvt. Ltd. (&quot;ShopSphere&quot;), an Indian corporation having its registered office in Bengaluru, Karnataka. By browsing our catalog, registering an account, or purchasing merchandise, you enter into a legally binding contract with ShopSphere.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-indigo-600" /> 2. Account Security &amp; Accuracy
          </h2>
          <p>
            When registering, you agree to provide authentic and accurate contact information. You are solely responsible for maintaining the confidentiality of your credentials and password. ShopSphere reserves the right to suspend or terminate accounts that provide misleading contact information or engage in abusive return activity.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-indigo-600" /> 3. Pricing, Taxes &amp; Product Representation
          </h2>
          <p>
            All prices displayed on ShopSphere are in Indian Rupees (INR ₹) and are inclusive of applicable Goods and Services Tax (GST) unless explicitly noted. While we endeavor to ensure the absolute fidelity of product descriptions, handloom textiles and handcrafted brass/copper items may display minor natural variations in weave texture and finish, celebrating the unique handmade nature of Indian crafts.
          </p>
          <p>
            We reserve the right to correct pricing errors. In the rare event a product is listed at an incorrect price due to a system glitch, ShopSphere reserves the right to cancel the order and issue a full refund.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-600" /> 4. Order Acceptance &amp; Payment Integrity
          </h2>
          <p>
            Placing an order constitutes an offer to buy. Order acceptance occurs when we confirm dispatch with an official consignment tracking number. For online payments, payments are routed through Razorpay. Any attempt to tamper with order totals or falsify transaction signatures will lead to immediate cancellation and potential blacklisting.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-600" /> 5. Governing Law &amp; Jurisdiction
          </h2>
          <p>
            These Terms of Service and any contractual dispute shall be governed by and construed in accordance with the laws of the Republic of India. The courts situated in Bengaluru, Karnataka shall possess exclusive jurisdiction over any proceeding arising out of these terms.
          </p>
        </section>
      </div>
    </div>
  );
}
