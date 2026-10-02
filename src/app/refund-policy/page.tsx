import Link from "next/link";
import { RefreshCw, CheckCircle2, Clock, AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Return & Refund Policy | ShopSphere India",
  description: "ShopSphere 7-day return guarantee, refund turnaround times, and hassle-free reverse pickup terms.",
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="space-y-3 border-b border-slate-200 pb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Customer Protection
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Returns, Exchanges &amp; Refund Policy
        </h1>
        <p className="text-xs text-slate-500">
          Last Updated: October 2026 &bull; Clear, transparent, and hassle-free 7-day return experience.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
        <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-2 shadow-sm">
          <Clock className="w-8 h-8 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">7-Day Window</h3>
          <p className="text-xs text-slate-500">
            Request return or replacement within 7 calendar days of receiving your package.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-2 shadow-sm">
          <RefreshCw className="w-8 h-8 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">Free Doorstep Pickup</h3>
          <p className="text-xs text-slate-500">
            Our courier partner collects the package directly from your address at zero extra cost.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-2 shadow-sm">
          <ShieldCheck className="w-8 h-8 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">Fast Disbursement</h3>
          <p className="text-xs text-slate-500">
            Refunds are credited back to your original source account within 3 to 5 business days.
          </p>
        </div>
      </div>

      <div className="prose prose-slate max-w-none space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" /> 1. Eligibility Criteria for Returns
          </h2>
          <p>
            We take tremendous pride in the quality of every product crafted and curated on ShopSphere. You are entitled to initiate a return or exchange under the following guidelines:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>The item must be unused, unwashed, and without perfume or bodily scents.</li>
            <li>Original tags, brand cards, Silk Mark authenticity certificates, and accessories must remain attached.</li>
            <li>Electronics must have all cables, warranty documentation, and intact serial numbers.</li>
            <li>The original product box must not be defaced or taped over directly with courier tape.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-indigo-600" /> 2. Non-Returnable Merchandise
          </h2>
          <p>For health, hygiene, and customized craft reasons, the following items cannot be returned unless received physically damaged or defective:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Ayurvedic beauty and skincare products where the safety seal has been opened or altered.</li>
            <li>Undergarments, innerwear, and intimate apparel.</li>
            <li>Custom-tailored blouse drapes or monogrammed products.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-indigo-600" /> 3. Step-by-Step Return Process
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>Initiate Request:</strong> Navigate to your <strong>Account &rarr; Orders</strong> page, select the specific order, and click &quot;Request Return / Exchange&quot;.
            </li>
            <li>
              <strong>Reverse Logistics Pickup:</strong> Our partnered courier will arrive at your registered address within 48 to 72 hours for collection.
            </li>
            <li>
              <strong>Quality Inspection:</strong> Once the package reaches our central Maharashtra logistics hub, a standard quality check is performed within 24 hours.
            </li>
            <li>
              <strong>Refund Disbursement:</strong> The full purchase amount (less applicable shipping if initial order didn&apos;t meet free threshold) will be released.
            </li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" /> 4. Refund Methods &amp; Timelines
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-200 rounded-xl overflow-hidden text-xs">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="p-3 border-b border-slate-200">Original Payment Mode</th>
                  <th className="p-3 border-b border-slate-200">Refund Destination</th>
                  <th className="p-3 border-b border-slate-200">Turnaround Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3">UPI (Google Pay, PhonePe, Paytm)</td>
                  <td className="p-3">Original Bank Account via UPI VPA</td>
                  <td className="p-3 font-semibold text-slate-900">24 - 48 Hours</td>
                </tr>
                <tr>
                  <td className="p-3">Credit / Debit Card</td>
                  <td className="p-3">Issuing Bank Card Account</td>
                  <td className="p-3 font-semibold text-slate-900">3 - 5 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3">Net Banking</td>
                  <td className="p-3">Originating Bank Account</td>
                  <td className="p-3 font-semibold text-slate-900">3 - 5 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3">Cash on Delivery (COD)</td>
                  <td className="p-3">Direct NEFT / IMPS Bank Transfer or UPI</td>
                  <td className="p-3 font-semibold text-slate-900">2 - 4 Business Days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Need help with an ongoing return?</h3>
            <p className="text-xs text-slate-600 mt-0.5">Reach out to our dedicated returns desk anytime.</p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            Contact Helpdesk <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
